#include <string.h>
#include <stdbool.h>
#include "fivebit.h"

#define ALLOWED_SYMBOLS " ,.?!\""

// check if the character is allowed to be encoded
static inline bool __allowed_char(char c)
{
    return (c >= 'a' && c <= 'z') ||
           c == ' ' ||
           c == ',' ||
           c == '.' ||
           c == '?' ||
           c == '"' ||
           c == '!';
}

// fit characters into 5bits integers
// a-z:              0-25
// ALLOWED_SYMBOLS: 26-31
static inline uint8_t __alpha_to_short(char c)
{
    if (c >= 'a' && c <= 'z')
        return (uint8_t)(c - 'a');

    switch (c) {
        case ' ': return 26;
        case ',': return 27;
        case '.': return 28;
        case '?': return 29;
        case '"': return 30;
        case '!': return 31;
    }

    return 255; // invalid character
}

// recover characters from 5bits representations
static inline char __short_to_alpha(uint8_t c)
{
    if (c < 26)
        return (char)(c + 'a');

    if (c < 32)
        return ALLOWED_SYMBOLS[c - 26];

    return '\0';
}

// encoder
size_t long_5bit_encode(
    char *text, uint8_t *output, uint8_t *padding)
{
    uint32_t buffer = 0;
    uint8_t  bits   = 0;
    size_t   outlen = 0;

    for (size_t _i = 0; text[_i] != 0; _i++) {

        if (!__allowed_char(text[_i])) continue;
        uint8_t c = __alpha_to_short(text[_i]);
        
        buffer = (buffer << 5) | c;
        bits   += 5;

        while (bits >= 8)
        {
            bits -= 8;
            output[outlen++] =
                (uint8_t)((buffer >> bits) & 0xff);
            if (bits) buffer &= (1u << bits) -1;
            else buffer =0;
        }
    }
    *padding = (8 - bits) % 8;
    if (bits) output[outlen++] =
            (uint8_t)((buffer << *padding) & 0xFF);
    return outlen;
}

// decoder
size_t short_5bit_decoder(
    uint8_t *data, char *out, size_t dsize,
    uint8_t padding, size_t cap)
{
    uint32_t buffer = 0;
    uint8_t  bits   = 0;
    size_t   outlen = 0;
    size_t   validb = (dsize * 8) - padding;

    for (size_t _t = 0; _t < dsize; _t++) {

        buffer = (buffer << 8) | data[_t];
        bits   += 8;

        while (bits >= 5 && validb >= 5)
        {
            bits   -= 5;
            validb -= 5;

            uint8_t v = (uint8_t)((buffer >> bits) & 0x1f);
            out[outlen++] = __short_to_alpha(v);
            if (bits) buffer &= (1u << bits) -1;
            else buffer = 0;
        }
    }
    out[outlen] = '\0';
    return outlen;
}

#include <stdio.h>


int main(void)
{
    char *m = "lmao this msut be encoded";

    uint8_t encoded[64];
    uint8_t padding;

    size_t es =
        long_5bit_encode(
            m,
            encoded,
            &padding
        );

    char decoded[64];

    size_t ds =
        short_5bit_decoder(
            encoded,
            decoded,
            es,
            padding,
            sizeof(decoded)
        );

    printf("Original: %s\n", m);
    printf("Encoded size: %zu bytes\n", es);
    printf("Padding: %u bits\n", padding);
    printf("Decoded: %s\n", decoded);
    printf("Decoded size: %zu\n", ds);

    return 0;
}