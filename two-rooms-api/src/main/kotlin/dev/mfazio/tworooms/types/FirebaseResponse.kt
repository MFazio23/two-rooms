package dev.mfazio.tworooms.types


data class FirebaseResponse<T>(
    val data: T? = null,
    val error: String? = null
)