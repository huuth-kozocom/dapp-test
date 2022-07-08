<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionEtherjsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions_etherjs', function (Blueprint $table) {
            $table->id();
            $table->string('from_wallet');
            $table->string('to_wallet');
            $table->string('network_id');
            $table->decimal('amount', 12, 10);
            $table->string('txHash');
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions_etherjs');
    }
}
