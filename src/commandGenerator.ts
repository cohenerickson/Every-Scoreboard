export function deleteCmd(type: Types, id: string, concat: boolean): string {
  let name = `${type}-${id}`;

  if (concat && name.length > 16) {
    const id = genId(name);
    name = `${name.substring(0, 16 - id.length)}${id}`;
  }

  return `scoreboard objectives remove ${name}`;
}

export function createCmd(
  type: Types,
  id: string,
  title: string,
  concat: boolean
): string {
  let command = "scoreboard objectives add";

  let name = `${type}-${id}`;

  if (concat && name.length > 16) {
    const id = genId(name);
    name = `${name.substring(0, 16 - id.length)}${id}`;
  }

  command += ` ${name} minecraft.`;

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

function genId(string: string): string {
  let sum = 0;
  for (let char of string) {
    sum = (sum + (char.charCodeAt(0) & 0xf)) ^ (char.charCodeAt(0) * 5);
  }
  return `+${sum}`;
}
