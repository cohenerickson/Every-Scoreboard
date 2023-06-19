import * as commandGenerator from "./commandGenerator";
import colors from "colors/safe";
import fs from "node:fs";
import path from "node:path";
import packFormat from "pack-format";
import prompts from "prompts";
import sort from "version-sort";

const cwd = process.cwd();

const availableVersions = fs
  .readdirSync(path.join(cwd, "./data"))
  .map((x) => x.replace(/\.json$/, ""));

(async () => {
  const { version } = await prompts({
    type: "select",
    name: "version",
    message: "Pick a version",
    choices: sort(availableVersions)
      .reverse()
      .map((x) => ({
        title: x,
        value: x
      })),
    initial: 0
  });

  const format = packFormat(version, "data");

  if (!format) {
    console.log(colors.red(colors.bold("Unable to parse pack format")));
    return;
  }

  // Earlier versions limit the lenght of scoreboard names to 16 characters
  const concat = format < 8;

  const data = JSON.parse(
    fs.readFileSync(path.join(cwd, "./data", `${version}.json`), "utf-8")
  );

  let createScript = "";
  let deleteScript = "";
  let tickScript = "";

  const blockIds: string[] = data[0].blocks.ordered_blocks;
  const items: { [key: string]: Item } = data[0].items.item;
  const entities: { [key: string]: Entity } = data[0].entities.entity;
  const stats: { [key: string]: Stat } = data[0].stats;

  for (const data of Object.values(items)) {
    let types = ["u", "c", "b", "p", "d"] as Types[];
    // add "mined" if item is a block
    if (blockIds.includes(data.text_id)) types.unshift("m");
    for (const type of types) {
      createScript += `${commandGenerator.createCmd(
        type,
        data.text_id,
        data.display_name,
        concat
      )}\n`;
      deleteScript += `${commandGenerator.deleteCmd(
        type,
        data.text_id,
        concat
      )}\n`;
    }
  }

  for (const data of Object.values(entities)) {
    // remove unexpected values
    if (!data.name.includes("~")) {
      for (const type of ["k", "kb"] as const) {
        createScript += `${commandGenerator.createCmd(
          type,
          data.name,
          data.display_name,
          concat
        )}\n`;
        deleteScript += `${commandGenerator.deleteCmd(
          type,
          data.name,
          concat
        )}\n`;
      }
    }
  }

  for (const [id, data] of Object.entries(stats)) {
    // remove unexpected values
    if (
      id.includes("minecraft.") &&
      !id.includes("_fished") &&
      !id.includes("ring_bell")
    ) {
      createScript += `${commandGenerator.createCmd(
        "z",
        id.replace(/^minecraft\./, ""),
        data.desc,
        concat
      )}\n`;
      deleteScript += `${commandGenerator.deleteCmd(
        "z",
        id.replace(/^minecraft\./, ""),
        concat
      )}\n`;
    }
  }

  for (const tool of ["Shovel", "Pickaxe", "Axe", "Hoe", "Sword"]) {
    createScript += `scoreboard objectives add u-${tool.toLowerCase()} dummy "Used ${tool}"\n`;

    for (const type of [
      "wooden",
      "stone",
      "iron",
      "golden",
      "diamond",
      "netherite"
    ]) {
      createScript += `scoreboard objectives add zu-${type.charAt(
        0
      )}${tool.toLowerCase()} minecraft.used:minecraft.${type}_${tool.toLowerCase()}\n`;
      deleteScript += `scoreboard objectives remove zu-${type.charAt(
        0
      )}${tool.toLowerCase()}\n`;
      tickScript += `execute as @a run scoreboard players operation @s u-${tool.toLowerCase()} += @s zu-${type.charAt(
        0
      )}${tool.toLowerCase()}\n`;
      tickScript += `scoreboard players reset @a zu-${type.charAt(
        0
      )}${tool.toLowerCase()}\n`;
    }
  }

  const dir = path.join(cwd, "./out", `./every-scoreboard-${version}`);
  const functionsDir = path.join(dir, `./data/every-scoreboard/functions`);
  const tagsDir = path.join(dir, `./data/minecraft/tags/functions`);

  write(
    path.join(dir, "./pack.mcmeta"),
    JSON.stringify(
      {
        pack: {
          description: `Every scoreboard, for Minecraft ${version}!`,
          pack_format: format
        }
      },
      null,
      2
    )
  );
  write(
    path.join(tagsDir, "./tick.json"),
    JSON.stringify(
      {
        values: ["every-scoreboard:tick"]
      },
      null,
      2
    )
  );
  write(
    path.join(tagsDir, "./load.json"),
    JSON.stringify(
      {
        values: ["every-scoreboard:create"]
      },
      null,
      2
    )
  );
  
  write(path.join(functionsDir, `./create.mcfunction`), createScript);
  write(path.join(functionsDir, `./delete.mcfunction`), deleteScript);
  write(path.join(functionsDir, `./tick.mcfunction`), tickScript);

  console.log(
    colors.green(colors.bold(`Generated out/every-scoreboard-${version}`))
  );
})();

function write(fileName: string, content: string): void {
  fs.mkdirSync(path.dirname(fileName), { recursive: true });
  fs.writeFileSync(fileName, content.replace(/\n?$/, "\n"), "utf-8");
}
