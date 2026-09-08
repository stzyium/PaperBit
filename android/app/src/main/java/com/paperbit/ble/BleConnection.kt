package com.paperbit.ble

import android.annotation.SuppressLint
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothGatt
import android.bluetooth.BluetoothGattCallback
import android.bluetooth.BluetoothGattCharacteristic
import android.bluetooth.BluetoothProfile
import android.content.Context
import com.paperbit.configs.PaperBitConstants

class BleConnection(
    private val context: Context
) {

    private var bluetoothGatt: BluetoothGatt? = null

    private var txCharacteristic:
        BluetoothGattCharacteristic? = null

    private var rxCharacteristic:
        BluetoothGattCharacteristic? = null


    @SuppressLint("MissingPermission")
    fun connect(device: BluetoothDevice) {

        bluetoothGatt = device.connectGatt(
            context,
            false,
            gattCallback
        )
    }


    @SuppressLint("MissingPermission")
    fun disconnect() {

        bluetoothGatt?.disconnect()
    }


    @SuppressLint("MissingPermission")
    fun close() {

        bluetoothGatt?.close()

        bluetoothGatt = null
    }


    private val gattCallback =
        object : BluetoothGattCallback() {


            override fun onConnectionStateChange(
                gatt: BluetoothGatt,
                status: Int,
                newState: Int
            ) {

                if (
                    newState ==
                    BluetoothProfile.STATE_CONNECTED
                ) {

                    println(
                        "PaperBit: Connected to ${gatt.device.address}"
                    )

                    bluetoothGatt = gatt

                    discoverServices(gatt)

                } else if (
                    newState ==
                    BluetoothProfile.STATE_DISCONNECTED
                ) {

                    println(
                        "PaperBit: Disconnected"
                    )

                    txCharacteristic = null
                    rxCharacteristic = null
                }
            }


            @SuppressLint("MissingPermission")
            private fun discoverServices(
                gatt: BluetoothGatt
            ) {

                println(
                    "PaperBit: Discovering services..."
                )

                gatt.discoverServices()
            }


            override fun onServicesDiscovered(
                gatt: BluetoothGatt,
                status: Int
            ) {

                if (
                    status !=
                    BluetoothGatt.GATT_SUCCESS
                ) {

                    println(
                        "PaperBit: Service discovery failed"
                    )

                    return
                }


                println(
                    "PaperBit: Services discovered"
                )


                val service =
                    gatt.getService(
                        PaperBitConstants.SERVICE_UUID
                    )


                if (service == null) {

                    println(
                        "PaperBit: Service not found"
                    )

                    gatt.disconnect()

                    return
                }


                println(
                    "PaperBit: PaperBit service found"
                )


                rxCharacteristic =
                    service.getCharacteristic(
                        PaperBitConstants.RX_UUID
                    )


                txCharacteristic =
                    service.getCharacteristic(
                        PaperBitConstants.TX_UUID
                    )


                if (
                    rxCharacteristic == null ||
                    txCharacteristic == null
                ) {

                    println(
                        "PaperBit: Characteristics not found"
                    )

                    gatt.disconnect()

                    return
                }


                println(
                    "PaperBit: Connection ready"
                )
            }
        }
}