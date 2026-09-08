#ifndef PAPERBIT_PACKET_H
#define PAPERBIT_PACKET_H

#include <cstdint>
#include <stdint.h>
#include <stddef.h>

#define PAPERBIT_PROTO_VERSION 1
#define PAPERBIT_DEFAULT_TTL 7

typedef enum {
    PACKET_DATA = 1,
    PACKET_ACK = 2,
    PACKET_HELLO = 3
} PacketType;

typedef struct {
    uint8_t head;
    uint32_t mseq;
    uint64_t desid;
    void *packet;
} MeshPacketHeader;


/*
 * serialize packet into a byte buffer
 */
size_t packet_serialize(
    const MeshPacket *packet,
    uint8_t *buffer,
    size_t buffer_size
);


/*
 * deserialize bytes into a MeshPacket
 *
 * returns 1 on success
 * returns 0 on failure
 */
int packet_deserialize(
    const uint8_t *buffer,
    size_t length,
    MeshPacketHeader *header
);

#endif