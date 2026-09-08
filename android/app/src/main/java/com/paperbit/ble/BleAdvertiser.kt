package com.paperbit.ble

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.os.ParcelUuid
import java.util.UUID
import com.paperbit.configs.PaperBitConstants

class BleAdvertiser(
    private val bluetoothAdapter: BluetoothAdapter
) {

    private val advertiser: BluetoothLeAdvertiser?
        get() = bluetoothAdapter.bluetoothLeAdvertiser

    private val paperbitUuid =
        ParcelUuid(
            PaperBitConstants.SERVICE_UUID
        )

    private val callback = object : AdvertiseCallback() {

        override fun onStartSuccess(
            settingsInEffect: AdvertiseSettings?
        ) {
            println("PaperBit advertising started")
        }

        override fun onStartFailure(errorCode: Int) {
            println(
                "Advertising failed: $errorCode"
            )
        }
    }

    @SuppressLint("MissingPermission")
    fun startAdvertising() {

        val settings =
            AdvertiseSettings.Builder()
                .setAdvertiseMode(
                    AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY
                )
                .setTxPowerLevel(
                    AdvertiseSettings.ADVERTISE_TX_POWER_MEDIUM
                )
                .setConnectable(true)
                .build()

        val data =
            AdvertiseData.Builder()
                .setIncludeDeviceName(false)
                .addServiceUuid(paperbitUuid)
                .build()

        advertiser?.startAdvertising(
            settings,
            data,
            callback
        )
    }

    @SuppressLint("MissingPermission")
    fun stopAdvertising() {
        advertiser?.stopAdvertising(callback)
    }
}