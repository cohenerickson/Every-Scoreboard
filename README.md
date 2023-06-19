# Every Scoreboard

A tool to generate scoreboard objectives for Minecraft.

Inspired by [every-scoreboard](https://github.com/samipourquoi/every-scoreboard) and updated to support the latest versions

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

## Creating Objectives

In order to create the scoreboard objectives, run this command in your Minecraft console

```
/function every-scoreboard:create
```

If the function doesn't show up you may need to run `/reload` in order to refresh the datapack list

In order to delete the objectives run this command

```
/function every-scoreboard:delete
```

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
