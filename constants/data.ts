import { EggType } from "./types";

export const eggsImg: Record<number, any> = {
    1: require('@/assets/images/game/egg.png'),
    2: require('@/assets/images/game/egg-speed-up.png'),
    3: require('@/assets/images/game/egg-slow-down.png'),
    4: require('@/assets/images/game/egg-2x-point.png'),
    5: require('@/assets/images/game/egg-5s-sec.png'),
    6: require('@/assets/images/game/egg-minus1000-points.png'),
    7: require('@/assets/images/game/egg-game-over.png'),
}

export const eggs: EggType[] = [
    {
        id: 1,
        desc: 'just an egg',
        img: 1,
        points: 100
    },
    {
        id: 2,
        desc: 'speed up the carriage',
        img: 2,
        points: 50,
        effect: 'speed_up'
    },
    {
        id: 3,
        desc: 'slow down the carriage',
        img: 3,
        points: 50,
        effect: 'slow_down'
    },
    {
        id: 4,
        desc: '2x your points for 5 sec.',
        img: 4,
        points: 200,
        effect: 'double_points'
    },
    {
        id: 5,
        desc: 'add 5 seconds',
        img: 5,
        points: 100,
        effect: 'add_time'
    },
    {
        id: 6,
        desc: '1000 point penalty',
        img: 6,
        points: -1000,
        effect: 'penalty'
    },
    {
        id: 7,
        desc: 'game over',
        img: 7,
        points: 0,
        effect: 'game_over'
    }
]