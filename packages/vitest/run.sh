#!/bin/bash

for i in {1..60}
do
  echo "Running test $i"
  pnpm vitest --run tofu
done

