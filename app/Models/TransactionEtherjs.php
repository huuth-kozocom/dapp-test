<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionEtherjs extends Model
{
    use HasFactory;

    protected $table = 'transactions_etherjs';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'from_wallet',
        'to_wallet',
        'network_id',
        'txHash',
        'amount',
        'status',
    ];

    const MASTER_WALLET = '0x8d834b4eCf449754affC35D9Ee21255bD07F6423';

    /**
     * Get ALl Pending Transactions
     *
     * @return mixed
     */
    public function pendingTransactions()
    {
        return $this->where('status', 1)->get();
    }
}
