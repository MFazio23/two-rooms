package dev.mfazio.tworooms.restclient.types

import com.github.kittinunf.fuel.core.FuelError

data class FirebaseRestResponse<T>(
    val data: T? = null,
    val error: FuelError? = null
) {
    fun wasSuccessful(): Boolean = data != null && error == null
}