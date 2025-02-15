import { describe, it, expect, beforeEach } from '@jest/globals'
import { is_finished, new_yahtzee, register, reroll, scores, Yahtzee } from '../model/yahtzee.game'
import { non_random } from './test_utils'
import { total_lower, total_upper } from '../model/yahtzee.score'
import { update } from '../utils/array_utils'
import { dice_roller } from '../model/dice'

describe("new game", () => {
  const yahtzee = new_yahtzee({
    players: ['A', 'B', 'C', 'D'], 
    randomizer: non_random(
      3, 1, 0, // Reversing in Fisher-Yates
      2, 4, 3, 1, 0 // First roll - one is added to these
    ) 
  })
  it("shuffles the order of players", () => {
    expect(yahtzee.players).toEqual(['D', 'C', 'B', 'A'])
  })
  it("has a upper section per player", () => {
    expect(yahtzee.upper_sections.length).toEqual(4)
  })
  it("has new upper sections", () => {
    expect(yahtzee.upper_sections.map(total_upper)).toEqual([0, 0, 0, 0])
  })
  it("has a lower section per player", () => {
    expect(yahtzee.lower_sections.length).toEqual(4)
  })
  it("has new lower sections", () => {
    expect(yahtzee.lower_sections.map(total_lower)).toEqual([0, 0, 0, 0])
  })
  it("starts with player index 0", () => {
    expect(yahtzee.playerInTurn).toEqual(0)
  })
  it("starts with die already rolled", () => {
    expect(yahtzee.roll).toEqual([3, 5, 4, 2, 1])
  })
  it("starts with having two rerolls remaining", () => {
    expect(yahtzee.rolls_left).toEqual(2)
  })
})

describe("reroll", () => {
  const yahtzee = new_yahtzee({
    players: ['A', 'B', 'C', 'D'], 
    randomizer: non_random(
      3, 1, 0, // Reversing in Fisher-Yates
      2, 4, 3, 1, 0, // First roll - one is added to these
      1, 5, //first re-roll
    ) 
  })
  it("replaces the non-held dice", () => {
    expect(reroll([1, 2, 3], yahtzee).roll).toEqual([2, 5, 4, 2, 6])
  })
  it("decrements the remaining rerolls", () => {
    expect(reroll([1, 2, 3], yahtzee).rolls_left).toEqual(1)
  })
  it("disallows re-rolling if no rolls are left", () => {
    expect(() => reroll([1, 2, 3], {...yahtzee, rolls_left: 0})).toThrow()
  })
})

describe("reroll", () => {
  const yahtzee = new_yahtzee({
    players: ['A', 'B', 'C', 'D'], 
    randomizer: non_random(
      3, 1, 0, // Reversing in Fisher-Yates
      2, 4, 3, 1, 0, // First roll - one is added to these
      1, 5, //first re-roll
    ) 
  })
  it("replaces the non-held dice", () => {
    expect(reroll([1, 2, 3], yahtzee).roll).toEqual([2, 5, 4, 2, 6])
  })
  it("decrements the remaining rerolls", () => {
    expect(reroll([1, 2, 3], yahtzee).rolls_left).toEqual(1)
  })
  it("disallows re-rolling if no rolls are left", () => {
    expect(() => reroll([1, 2, 3], {...yahtzee, rolls_left: 0})).toThrow()
  })
})

describe("register", () => {
  describe("registering in the upper section", () => {
    const yahtzee = new_yahtzee({
      players: ['A', 'B', 'C', 'D'], 
      randomizer: non_random(
        3, 1, 0, // Reversing in Fisher-Yates
        2, 4, 3, 1, 0, // First roll - one is added to these
        1, 5, //first re-roll
        2, // second re-roll
        5, 4, 3, 2, 1, // new re-roll
      ) 
    })
    const rerolled = reroll([1, 2, 3], yahtzee)
    const rerolled_twice = reroll([1, 2, 3, 4], rerolled)
    const registered = register(2, rerolled_twice)
    it("registers the score", () => {
      expect(total_upper(registered.upper_sections[0])).toEqual(2)
    })
    it("moves to the next player", () => {
      expect(registered.playerInTurn).toEqual(1)
    })
    it("moves to the first player after the last player", () => {
      const registered = register(2, { ...rerolled_twice, playerInTurn: 3 })
      expect(registered.playerInTurn).toEqual(0)
    })
    it("rolls new dice", () => {
      expect(registered.roll).toEqual([6, 5, 4, 3, 2])
    })
    it("has two rerolls left", () => {
      expect(registered.rolls_left).toEqual(2)
    })
    it("disallows registering an already registered slot", () => {
      const section = rerolled_twice.upper_sections[0]
      const used = {
        ...rerolled_twice,
        upper_sections: update(0, {scores: {...section.scores, [2]: 8}}, rerolled_twice.upper_sections)
      }
      expect(() => register(2, used)).toThrow()
    })
    it("allows registering before all rerolls are used", () => {
      const registered = register(2, yahtzee)
      expect(total_upper(registered.upper_sections[0])).toEqual(2)
    })
  })

  describe("registering in lower the section", () => {
    const yahtzee = new_yahtzee({
      players: ['A', 'B', 'C', 'D'], 
      randomizer: non_random(
        3, 1, 0, // Reversing in Fisher-Yates
        2, 4, 3, 1, 0, // First roll - one is added to these
        1, 5, //first re-roll
        2, // second re-roll
        5, 4, 3, 2, 1, // new re-roll
      ) 
    })
    const rerolled = reroll([1, 2, 3], yahtzee)
    const rerolled_twice = reroll([1, 2, 3, 4], rerolled)
    const registered = register('large straight', rerolled_twice)
    it("registers the score", () => {
      expect(total_lower(registered.lower_sections[0])).toEqual(20)
    })
    it("moves to the next player", () => {
      expect(registered.playerInTurn).toEqual(1)
    })
    it("moves to the first player after the last player", () => {
      const registered = register('large straight', { ...rerolled_twice, playerInTurn: 3 })
      expect(registered.playerInTurn).toEqual(0)
    })
    it("rolls new dice", () => {
      expect(registered.roll).toEqual([6, 5, 4, 3, 2])
    })
    it("has two rerolls left", () => {
      expect(registered.rolls_left).toEqual(2)
    })
    it("disallows registering an already registered slot", () => {
      const section = rerolled_twice.lower_sections[0]
      const used = {
        ...rerolled_twice,
        lower_sections: update(0, {scores: {...section.scores, ['large straight']: 20}}, rerolled_twice.lower_sections)
      }
      expect(() => register('large straight', used)).toThrow()
    })
    it("allows registering before all rerolls are used", () => {
      const registered = register('small straight', yahtzee)
      expect(total_lower(registered.lower_sections[0])).toEqual(15)
    })
  })
})

const finished: Yahtzee = {
  players: ['B', 'A'],
  upper_sections: [{
    scores: {[1]: 3, [2]: 6, [3]: 9, [4]: 12, [5]: 15, [6]: 18},
    bonus: 50
  }, {
    scores: {[1]: 2, [2]: 6, [3]: 9, [4]: 12, [5]: 15, [6]: 18},
    bonus: 0
  }],
  lower_sections: [{scores: {
    'pair': 12,
    'two pairs': 20,
    'three of a kind': 15,
    'four of a kind': 0,
    'small straight': 15,
    'large straight': 0,
    'full house': 0,
    'chance': 22,
    'yahtzee': 0
  }},
  {scores: {
    'pair': 10,
    'two pairs': 18,
    'three of a kind': 18,
    'four of a kind': 16,
    'small straight': 0,
    'large straight': 0,
    'full house': 26,
    'chance': 24,
    'yahtzee': 50
  }}],
  playerInTurn: 0,
  roll: [],
  rolls_left: 2,
  roller: dice_roller(() => 0)
}

const {roller, ...cloneable } = finished
const almost_finished = {...structuredClone(cloneable), roller}
almost_finished.lower_sections[0].scores['yahtzee'] = undefined
almost_finished.upper_sections[1].scores[1] = undefined

describe("scores", () => {
  it("returns an array with the sums of the scores", () => {
    expect(scores(finished)).toEqual([113 + 84, 62 + 162])
  })
  it("also works on unfinished games", () => {
    expect(scores(almost_finished)).toEqual([113 + 84, 60 + 162])
  })
  it("returns zeroes for a new game", () => {
    const yahtzee = new_yahtzee({
      players: ['A', 'B', 'C', 'D'], 
      randomizer: non_random(
        3, 1, 0, // Reversing in Fisher-Yates
        2, 4, 3, 1, 0 // First roll - one is added to these
      ) 
    })
    expect(scores(yahtzee)).toEqual([0, 0, 0, 0])
  })
})

describe("is_finished", () => {
  it("returns false if the game isn't finished", () => {
    expect(is_finished(almost_finished)).toBeFalsy()
  })
  it("returns true if the game is finished", () => {
    expect(is_finished(finished)).toBeTruthy()
  })
})
