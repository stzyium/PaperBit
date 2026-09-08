package com.paperbit.ble

import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.os.ParcelUuid
import com.paperbit.configs.PaperBitConstants

class BleDiscovery(
    private val bluetoothAdapter: BluetoothAdapter,
    private val onDeviceFound: (ScanResult) -> Unit
) {

    private val scanner: BluetoothLeScanner?
        get() = bluetoothAdapter.bluetoothLeScanner

    private val scanCallback = object : ScanCallback() {

        override fun onScanResult(
            callbackType: Int,
            result: ScanResult
        ) {
            onDeviceFound(result)
        }

        override fun onScanFailed(errorCode: Int) {
            println("BLE scan failed: $errorCode")
        }
    }

    @SuppressLint("MissingPermission")
    fun start() {

        val filter = ScanFilter.Builder()
            .setServiceUuid(
                ParcelUuid(
                    PaperBitConstants.SERVICE_UUID
                )
            )
            .build()

        val settings = ScanSettings.Builder()
            .setScanMode(
                ScanSettings.SCAN_MODE_LOW_LATENCY
            )
            .build()

        scanner?.startScan(
            listOf(filter),
            settings,
            scanCallback
        )
    }

    @SuppressLint("MissingPermission")
    fun stop() {
        scanner?.stopScan(scanCallback)
    }
}