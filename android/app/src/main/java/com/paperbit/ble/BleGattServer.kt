package com.paperbit.ble

import android.annotation.SuppressLint
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothGattDescriptor
import android.bluetooth.BluetoothGattServer
import android.bluetooth.BluetoothGattServerCallback
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.content.Context
import com.paperbit.configs.PaperBitConstants
import java.util.UUID

class BleGattServer(
    private val context: Context
) {

    private val bluetoothManager =
        context.getSystemService(
            Context.BLUETOOTH_SERVICE
        ) as BluetoothManager

    private var gattServer: BluetoothGattServer? = null


    private val rxCharacteristic =
        BluetoothGattCharacteristic(
            PaperBitConstants.RX_UUID,
            BluetoothGattCharacteristic.PROPERTY_WRITE,
            BluetoothGattCharacteristic.PERMISSION_WRITE
        )


    private val txCharacteristic =
        BluetoothGattCharacteristic(
            PaperBitConstants.TX_UUID,
            BluetoothGattCharacteristic.PROPERTY_NOTIFY,
            BluetoothGattCharacteristic.PERMISSION_READ
        )


    private val cccdDescriptor =
        BluetoothGattDescriptor(
            UUID.fromString(
                "00002902-0000-1000-8000-00805f9b34fb"
            ),
            BluetoothGattDescriptor.PERMISSION_READ or
                    BluetoothGattDescriptor.PERMISSION_WRITE
        )


    private val paperbitService =
        android.bluetooth.BluetoothGattService(
            PaperBitConstants.SERVICE_UUID,
            android.bluetooth.BluetoothGattService.SERVICE_TYPE_PRIMARY
        )


    private val callback =
        object : BluetoothGattServerCallback() {


            override fun onConnectionStateChange(
                device: android.bluetooth.BluetoothDevice,
                status: Int,
                newState: Int
            ) {

                if (
                    newState ==
                    BluetoothProfile.STATE_CONNECTED
                ) {

                    println(
                        "PaperBit: Client connected: " +
                        device.address
                    )

                } else if (
                    newState ==
                    BluetoothProfile.STATE_DISCONNECTED
                ) {

                    println(
                        "PaperBit: Client disconnected: " +
                        device.address
                    )
                }
            }


            override fun onCharacteristicWriteRequest(
                device: android.bluetooth.BluetoothDevice,
                requestId: Int,
                characteristic:
                    BluetoothGattCharacteristic,
                preparedWrite: Boolean,
                responseNeeded: Boolean,
                offset: Int,
                value: ByteArray
            ) {

                if (
                    characteristic.uuid ==
                    PaperBitConstants.RX_UUID
                ) {

                    println(
                        "PaperBit: Received ${value.size} bytes"
                    )

                    println(
                        "Data: ${value.decodeToString()}"
                    )
                }


                if (responseNeeded) {

                    gattServer?.sendResponse(
                        device,
                        requestId,
                        BluetoothGatt.GATT_SUCCESS,
                        0,
                        null
                    )
                }
            }


            override fun onDescriptorWriteRequest(
                device: android.bluetooth.BluetoothDevice,
                requestId: Int,
                descriptor: BluetoothGattDescriptor,
                preparedWrite: Boolean,
                responseNeeded: Boolean,
                offset: Int,
                value: ByteArray
            ) {

                if (
                    descriptor.uuid ==
                    cccdDescriptor.uuid
                ) {

                    println(
                        "PaperBit: Notifications configured"
                    )
                }


                if (responseNeeded) {

                    gattServer?.sendResponse(
                        device,
                        requestId,
                        BluetoothGatt.GATT_SUCCESS,
                        0,
                        null
                    )
                }
            }
        }


    @SuppressLint("MissingPermission")
    fun start() {

        gattServer =
            bluetoothManager.openGattServer(
                context,
                callback
            )


        txCharacteristic.addDescriptor(
            cccdDescriptor
        )


        paperbitService.addCharacteristic(
            rxCharacteristic
        )

        paperbitService.addCharacteristic(
            txCharacteristic
        )


        gattServer?.addService(
            paperbitService
        )


        println(
            "PaperBit: GATT server started"
        )
    }
    @SuppressLint("MissingPermission")
    fun stop() {
        gattServer?.close()
        gattServer = null
        println(
            "PaperBit: GATT server stopped"
        )
    }


    @SuppressLint("MissingPermission")
    fun send(
        device: android.bluetooth.BluetoothDevice,
        data: ByteArray
    ) {

        txCharacteristic.value = data

        gattServer?.notifyCharacteristicChanged(
            device,
            txCharacteristic,
            false
        )
    }
}