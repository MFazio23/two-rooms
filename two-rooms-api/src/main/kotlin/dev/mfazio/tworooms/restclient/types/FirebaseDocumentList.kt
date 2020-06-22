package dev.mfazio.tworooms.restclient.types

import kotlinx.serialization.Serializable

@Serializable
data class FirebaseDocumentList(
    val documents: List<FirebaseDocument>,
    val nextPageToken: String
)