# Every Scoreboard

A tool to generate scoreboard objectives for Minecraft.

## Compiling Scripts

In order to run this script you need to have [NodeJS](https://nodejs.org/) installed on your system

### Cloning

```shell
git clone https://github.com/cohenerickson/Every-Scoreboard
cd Every-Scoreboard
```

### Installing Dependencies

```shell
npm install
```

### Compiling

Run the following command and follow the steps

```shell
npm start
```

Datapacks can be found in the `./out` directory after compilation

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

```shell
python munch.py --download {version} --output ./{version}.json --toppings blocks,entities,items,stats
```
