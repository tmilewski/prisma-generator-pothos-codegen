import { DMMF } from '@prisma/generator-helper';

export type InputType = DMMF.SchemaArgInputType
/**
 * Sometimes, input types is a list
 * But inputtypes from Graphql cannot be an Union
 * This function will find the main input type
 */
export function getMainInput() {
  // If one list, priorize it
  const priorizeList = (inputs: InputType[]) => {
    const listInputs = inputs.filter(el => el.isList)
    const exactlyOneIsList = listInputs.length === 1
    if (exactlyOneIsList) {
      return listInputs[0]
    }
  }

  // If two, priorize not scalar
  const priorizeNotScalar = (inputs: InputType[]) => {
    const listInputs = inputs.filter(el => el.isList)
    const exactlyOneIsList = listInputs.length === 0
    if (exactlyOneIsList) {
      return inputs.find(el => el.location !== 'scalar')
    }
  }

  const run = (inputs: InputType[]): InputType => {
    if (inputs.length === 0) throw new Error('No input type found')
    const first = inputs[0]!
    const second = inputs[1]
    if (first && !second) return first

    const isListPriority = priorizeList(inputs)
    if (isListPriority) return isListPriority

    const isNotScalarPriority = priorizeNotScalar(inputs)
    if (isNotScalarPriority) return isNotScalarPriority

    return inputs[0]!
  }

  return {
    run,
    priorizeNotScalar,
    priorizeList,
  }
}