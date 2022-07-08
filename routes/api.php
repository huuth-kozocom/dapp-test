<?php

use App\Http\Controllers\TransactionWeb3jsController;
use App\Http\Controllers\TransactionEtherjsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('transaction-web3js')->group(function () {
    Route::get('/', [TransactionWeb3jsController::class, 'index'])->name('transaction-web3js');
    Route::post('/create', [TransactionWeb3jsController::class, 'create'])->name('transaction-web3js.create');
});

Route::prefix('transaction-etherjs')->group(function () {
    Route::get('/', [TransactionEtherjsController::class, 'index'])->name('transaction-etherjs');
    Route::post('/create', [TransactionEtherjsController::class, 'create'])->name('transaction-etherjs.create');
});