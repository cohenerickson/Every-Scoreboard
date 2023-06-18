import fs from "node:fs";
import path from "node:path";
import packFormat from "pack-format";
import prompts from "prompts";

type Types = "m" | "u" | "c" | "b" | "p" | "d" | "k" | "kb" | "z";

const __dirname = process.cwd();

const availableVersions = fs.readdirSync(path.join(__dirname, "./data"));

const { version } = await prompts({
  type: "select",
  name: "version",
  message: "Pick a version",
  choices: availableVersions.map((x) => ({
    title: x.replace(/\.json$/, ""),
    value: x.replace(/\.json$/, "")
  })),
  initial: 0
});

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./data", `${version}.json`), "utf-8")
);

let createScript = "";
let deleteScript = "";

const blockIds: string[] = data[0].blocks.ordered_blocks;
const items: { [key: string]: any } = data[0].items.item;
const entities: { [key: string]: any } = data[0].entities.entity;
const stats: { [key: string]: any } = data[0].stats;

for (const data of Object.values(items)) {
  let types = ["u", "c", "b", "p", "d"] as Types[];
  // add mined if item is a block
  if (blockIds.includes(data.text_id)) types.unshift("m");
  for (const type of types) {
    createScript += `${generateCreateCommand(
      type,
      data.text_id,
      data.display_name
    )}\n`;
    deleteScript += `${generateDeleteCommand(type, data.text_id)}\n`;
  }
}

for (const data of Object.values(entities)) {
  // Remove strange values
  if (!data.name.includes("~")) {
    for (const type of ["k", "kb"] as const) {
      createScript += `${generateCreateCommand(
        type,
        data.name,
        data.display_name
      )}\n`;
      deleteScript += `${generateDeleteCommand(type, data.name)}\n`;
    }
  }
}

for (const [id, data] of Object.entries(stats)) {
  // Remove values that will throw an error
  if (
    id.includes("minecraft.") &&
    !id.includes("_fished") &&
    !id.includes("ring_bell")
  ) {
    createScript += `${generateCreateCommand(
      "z",
      id.replace(/^minecraft\./, ""),
      data.desc
    )}\n`;
    deleteScript += `${generateDeleteCommand(
      "z",
      id.replace(/^minecraft\./, "")
    )}\n`;
  }
}

const dir = path.join(__dirname, "./out", `./every-scoreboard-${version}`);
const functionsDir = path.join(
  dir,
  `./data/every-scoreboard-${version}/functions`
);
write(
  path.join(dir, "./pack.mcmeta"),
  JSON.stringify(
    {
      pack: {
        description: `Every scoreboard, for Minecraft ${version}!`,
        pack_format: packFormat(version)
      }
    },
    null,
    2
  )
);
write(path.join(functionsDir, `./create.mcfunction`), createScript);
write(path.join(functionsDir, `./delete.mcfunction`), deleteScript);

function write(fileName: string, content: string): void {
  fs.mkdirSync(path.dirname(fileName), { recursive: true });
  fs.writeFileSync(fileName, content.replace(/\n?$/, "\n"), "utf-8");

  console.log(`Generated ${path.basename(fileName)}`);
}

function generateDeleteCommand(type: Types, id: string): string {
  return `scoreboard objectives remove ${type}-${id}`;
}

function generateCreateCommand(type: Types, id: string, title: string): string {
  let command = "scoreboard objectives add";
  command += ` ${type}-${id} minecraft.`;

  let prefix = "";
  switch (type) {
    case "m":
      command += "mined";
      prefix = "Mined";
      break;
    case "u":
      command += "used";
      prefix = "Used";
      break;
    case "c":
      command += "crafted";
      prefix = "Crafted";
      break;
    case "b":
      command += "broken";
      prefix = "Broken";
      break;
    case "p":
      command += "picked_up";
      prefix = "Picked Up";
      break;
    case "d":
      command += "dropped";
      prefix = "Dropped";
      break;
    case "k":
      command += "killed";
      prefix = "Killed";
      break;
    case "kb":
      command += "killed_by";
      prefix = "Killed By";
      break;
    case "z":
      command += "custom";
      break;
  }
  command += `:minecraft.${id} `;

  command += `"${prefix ? `${prefix} - ` : ""}${title}"`;

  return command;
}
