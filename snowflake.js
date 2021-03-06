//
// Twitter Snowflake
//
// Currently about 750k ops/sec on a 2014 MBP
// Could speed up 1.3x by using UInt8Array and "carryMasks"
// https://github.com/indutny/bn.js/blob/master/lib/bn.js#L1953
//

var EPOCH = 946684800000;
var MACHINE = 1;
var MAX_BITS = 64;
var BIT_VAL = [ 
	1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 
	65536, 131072, 262144, 524288, 1048576, 2097152, 4194304, 8388608, 16777216, 
	33554432, 67108864, 134217728, 268435456, 536870912, 1073741824, 2147483648, 
	4294967296, 8589934592, 17179869184, 34359738368, 68719476736, 137438953472, 
	274877906944, 549755813888, 1099511627776, 2199023255552, 4398046511104,//42
	8796093022208, 17592186044416, 35184372088832, 70368744177664, 
	140737488355328, 281474976710656, 562949953421312, 1125899906842624, 
	2251799813685248, 4503599627370496, 9007199254740992, 18014398509481984, 
	36028797018963970, 72057594037927940, 144115188075855870, 288230376151711740, 
	576460752303423500, 1152921504606847000, 2305843009213694000, 
	4611686018427388000, 9223372036854776000
];

function toInt(b) {
	var i, l, val = 0;
	for (i = b.length - 1; i >= 0; i--) {
		if (b[i]) {
			val += BIT_VAL[i];
		}
	}
	return val;
}

function toBits(val, bits) {
	bits = bits || MAX_BITS;
	b = new Array(bits);
	for (i = bits - 1; i >= 0; i--) {
		if (val >= BIT_VAL[i]) {
			b[i] = true;
			val -= BIT_VAL[i];
			if (val == 0) break;
		}
	}
	return b;
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function snowflake(mac, seq, time, epoch) {

	// defaults
	seq = seq || rnd(0,4096);
	mac = mac || MACHINE;
	time = (time || (+new Date)) - (epoch || EPOCH);

	// 512 bits = (42 timestamp, 10 machine, 12 sequence)
	return toInt([].concat(
		toBits(seq, 12),
		toBits(mac, 10),
		toBits(time, 42)
	));
}

module && (module.exports = snowflake);