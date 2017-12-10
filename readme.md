# Promize

An implementation of [Promise A+](https://promisesaplus.com/) spec.
[promises-aplus-tests](https://github.com/promises-aplus/promises-tests) passed.

# Benchmark

```
Date: Sun Dec 10 2017 21:36:49 GMT+0800 (CST)
Node v9.2.1
OS   sierra
Arch x64
CPU  2.6 GHz Intel Core i7
```

| name    | heap used | (init / resolve) time |
| ------- | --------- | --------------------- |
| native  | 113M      | 323ms / 295ms         |
| Promize | 244M      | 604ms / 487ms         |
