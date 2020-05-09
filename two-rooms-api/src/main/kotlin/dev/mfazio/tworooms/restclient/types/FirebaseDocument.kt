package dev.mfazio.tworooms.restclient.types

data class FirebaseDocument(
    val name: String? = null,
    val createTime: String? = null,
    val updateTime: String? = null,
    val fields: Map<String, ValueObject>? = null
)