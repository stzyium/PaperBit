#pragma once

#include <stddef.h>
#include <stdint.h>

// encoder
size_t long_5bit_encode(char *text, uint8_t *output, uint8_t *padding);
// decoder
size_t short_5bit_decoder(
    uint8_t *data, char *out, size_t dsize,
    uint8_t padding, size_t cap);