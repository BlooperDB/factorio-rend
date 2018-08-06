import { Blueprint } from "./render/Blueprint";
import * as ItemData from "./render/ItemData";

const item = ItemData.getEntity("assembling-machine-2");
console.log(JSON.stringify(item));

const blueprint = new Blueprint("sample_blueprint.txt");
console.log(JSON.stringify(blueprint));

/*
let start = Date.now();
blueprint.render("sample.png", 10).then(() => {
  console.log("First Round:", Date.now() - start, "ms");
  start = Date.now();
  blueprint.render("sample.png").then(() => {
    console.log("Second Round:", Date.now() - start, "ms");

    start = Date.now();

    blueprint.render("sample.png").then(() => {
      console.log("Third Round:", Date.now() - start, "ms");
    });
  });

  for (let i = 0; i < 16; i++) {
    blueprint.render("output/animation_" + i + ".png", i).then(() => {
      console.log("Completed frame:", i);
    });
  }
});
*/

for (let i = 0; i < 64; i++) {
  blueprint.render("output/animation_" + i + ".png", i).then(() => {
    console.log("Completed frame:", i);
  });
}
