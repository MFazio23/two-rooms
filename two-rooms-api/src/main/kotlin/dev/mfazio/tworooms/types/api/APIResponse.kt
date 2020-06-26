package dev.mfazio.tworooms.types.api

import kotlinx.serialization.Serializable

@Serializable
data class APIResponse<T>(
    val message: String? = null,
    val data: T? = null
)