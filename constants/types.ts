export type EggType = {
    id: number;
    desc: string;
    img: number;
    points: number;
    effect?: 'speed_up' | 'slow_down' | 'double_points' | 'add_time' | 'penalty' | 'game_over';
}

export type ScoreType = {
    score: number;
}

export type GameState = {
    isActive: boolean;
    score: number;
    timeLeft: number;
    level: number;
}