<?php

namespace App\Console\Commands;

use App\Models\TransactionWeb3js;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class ValidatorTransactionWeb3jsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'validate:metamask-web3js';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Metamask Transactions Validator Command';

    protected $transactions;

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
        $this->transactions = new TransactionWeb3js();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        return $this->validateTransactions();
    }

    /**
     * Validate Metamask Transaction
     *
     * @return void
     */
    public function validateTransactions()
    {
        $master_account = TransactionWeb3js::MASTER_WALLET; //please paste your master Metamask account address here
        $transactions = $this->transactions->pendingTransactions(); //get Pending Transactions From Database [which are older than 20min]
        //Run foreach to check transactions one by one.
        foreach ($transactions as $transaction) {
            //get transaction information from etherscan
            $response = $this->checkWithEtherScan($transaction->txHash);
            //validate response
            if ($response && array_key_exists('result', $response)) {
                $tr_data = $response['result'];
                //validate transaction destination with our account [destination must be our master account].
                if (strtolower($tr_data['to']) == strtolower($master_account)) {
                    // Update Transaction As Success
                    $transaction->status = 2;
                    $transaction->update();
                }
                else {
                    // Update Transaction As Canceled
                    $transaction->status = 0;
                    $transaction->update();
                }
            } else {
                // Update Transaction As Canceled
                $transaction->status = 0;
                $transaction->update();
            }
        }
    }
    /**
     * Check Transaction With Ether Scan
     *
     * @param  mixed $transaction_hash
     * @return mixed
     */
    public function checkWithEtherScan($transaction_hash)
    {
        $api_key = "ENBK5HBW1JFGY2INMUN28UDA88VM1Y6GJS"; // pase your api key here. which was copied from Etherscan.io
        $test_network = "https://api-ropsten.etherscan.io"; // in this tutorial we use only test networks
        $main_network = "https://etherscan.io"; // if you want to go live you must use main network.
        $response = Http::get($test_network . "/api/?module=proxy&action=eth_getTransactionByHash&txhash="
            . $transaction_hash . '&apikey=' . $api_key);
        return $response->json();
    }
}
