package dev.mfazio.tworooms.restclient.types

import kotlinx.serialization.Serializable

@Serializable
data class FirebaseDocument(
    val name: String? = null,
    val createTime: String? = null,
    val updateTime: String? = null,
    val fields: Map<String, ValueObject>? = null
)