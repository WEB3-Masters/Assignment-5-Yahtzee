import * as Y from './yahtzee.game'

export type IndexedYahtzee = Readonly<Omit<Y.Yahtzee, 'roller'> & { id: number, pending: false }>

export type IndexedYahtzeeSpecs = Readonly<Y.YahtzeeSpecs & { id: number, pending: true }>