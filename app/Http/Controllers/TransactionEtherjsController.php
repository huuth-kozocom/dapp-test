<?php

namespace App\Http\Controllers;

use App\Models\TransactionEtherjs;
use Illuminate\Http\Request;

class TransactionEtherjsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $transaction = TransactionEtherjs::orderBy('id', 'desc')->get();
        return response()->json($transaction);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        return TransactionEtherjs::create([
            "from_wallet" => $request->from_wallet,
            "to_wallet" => $request->to_wallet,
            "network_id" => $request->network_id,
            "txHash" => $request->txHash,
            "amount" => $request->amount,
            "status" => $request->status,
        ]);
    }
}
