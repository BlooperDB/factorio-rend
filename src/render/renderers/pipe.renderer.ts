import { BlueprintEntity, EntitySprite, RenderPassType, SpriteData, Vector } from "../../models";
import { EntityGridView } from "../Blueprint";
import { getEntity } from "../ItemData";
import GenericRenderer from "./generic.renderer";

export default class PipeRenderer extends GenericRenderer {

  public async renderPass(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean = false, animationFrame: number = 0, grid: EntityGridView): Promise<EntitySprite> {
    const ent = getEntity(entity.name);

    if (!ent) {
      throw new Error(`Entity '${entity.name}' doesn't exist!`);
    }

    const pictures = ent.entity.pictures;

    if (!pictures || !("straight_horizontal" in pictures)) {
      throw new Error(`Unable to render ${entity.name}`);
    }

    const around = this.getAround(entity.position, grid);
    const count = around.reduce((a: number, b: number) => a + b, 0);

    let source = pictures.straight_horizontal;
    switch (count) {
      default:
      case 0:
        break;
      case 1:
        if (around[0]) {
          source = pictures.ending_up;
        } else if (around[1]) {
          source = pictures.ending_right;
        } else if (around[2]) {
          source = pictures.ending_down;
        } else {
          source = pictures.ending_left;
        }
        break;
      case 2:
        if (around[0]) {
          if (around[1]) {
            source = pictures.corner_up_right;
          } else if (around[2]) {
            source = pictures.straight_vertical;
          } else if (around[3]) {
            source = pictures.corner_up_left;
          }
        } else if (around[1]) {
          if (around[2]) {
            source = pictures.corner_down_right;
          } else if (around[3]) {
            source = pictures.straight_horizontal;
          }
        } else {
          source = pictures.corner_down_left;
        }
        break;
      case 3:
        if (!around[0]) {
          source = pictures.t_down;
        } else if (!around[1]) {
          source = pictures.t_left;
        } else if (!around[2]) {
          source = pictures.t_up;
        } else if (!around[3]) {
          source = pictures.t_right;
        }
        break;
      case 4:
        source = pictures.cross;
        break;
    }

    return this.loadSprite(source as SpriteData, entity, pass, "", highRes, animationFrame, grid);
  }

  public getKey(entity: BlueprintEntity, pass: RenderPassType, highRes: boolean, animationFrame: number, grid: EntityGridView): string {
    return entity.name + "_" + (entity.direction || 0) + "_" + pass + "_" + this.getAround(entity.position, grid).join("_") + "_" + animationFrame;
  }

  public getAround(pos: Vector, grid: EntityGridView): any {
    return [
      pos.x in grid.fluids && pos.y - 0.5 in grid.fluids[pos.x] && grid.fluids[pos.x][pos.y - 0.5] > 1,
      pos.x + 0.5 in grid.fluids && pos.y in grid.fluids[pos.x + 0.5] && grid.fluids[pos.x + 0.5][pos.y] > 1,
      pos.x in grid.fluids && pos.y + 0.5 in grid.fluids[pos.x] && grid.fluids[pos.x][pos.y + 0.5] > 1,
      pos.x - 0.5 in grid.fluids && pos.y in grid.fluids[pos.x - 0.5] && grid.fluids[pos.x - 0.5][pos.y] > 1
    ];
  }

}
