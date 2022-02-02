import { Game } from '@/game'
console.log('main')
if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
  }
new Game().Awake()