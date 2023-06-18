# Every Scoreboard

A tool to generate scoreboard objectives for Minecraft.

## Naming

- `m-<block>` Mined blocks
- `u-<item>` Used items
- `c-<item>` Crafted items
- `b-<item>` Broken tools
- `p-<item>` Picked up items
- `d-<item>` Dropped items
- `k-<mob>` Killed mobs
- `kb-<mob>` Killed by mob
- `z-<stats>` Custom

## Adding Versions

Use [Burger](https://github.com/Pokechu22/Burger) to extract data files for {version}

Move the resulting {version}.json file into the ./data directory

```bash
python munch.py --download {version} --output ./{version}.json --toppings blocks,entities,items,stats
```
