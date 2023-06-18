type Types = "m" | "u" | "c" | "b" | "p" | "d" | "k" | "kb" | "z";

type Item = {
  class: string;
  display_name: string;
  field: string;
  max_stack_size: number;
  numeric_id: number;
  text_id: string;
};

type Entity = {
  class: string;
  display_name: string;
  field: string;
  height: number;
  id: number;
  name: string;
  width: number;
};

type Stat = {
  desc: string;
};

declare module "version-sort" {
  function sort(versions: string[]): string[];

  export default sort;
}
