package com.vira.fantasy.engine;

import org.springframework.stereotype.Component;

@Component
public class FantasyScorer {

    public int score(PlayerStatsView s) {
        int total = minutesPoints(s.getMinutes());
        total += discipline(s);

        switch (s.getPosition()) {
            case "DEF" -> total += scoreDef(s);
            case "MID" -> total += scoreMid(s);
            case "FWD" -> total += scoreFwd(s);
            case "GK"  -> total += 0;
        }

        total = normalize(total, s.getMinutes());
        return cap(total, s.getPosition());
    }

    /* ---------- BASE ---------- */
    private int minutesPoints(int m) {
        if (m < 15) return 0;
        if (m < 45) return 1;
        if (m < 60) return 2;
        if (m < 90) return 3;
        return 4;
    }

    private int discipline(PlayerStatsView s) {
        return -s.getCrdy() - (s.getCrdr() * 3);
    }

    private int normalize(int total, int m) {
        if (m < 30) return Math.round(total * 0.4f);
        if (m < 60) return Math.round(total * 0.7f);
        return total;
    }

    /* ---------- DEF ---------- */

    private int scoreDef(PlayerStatsView s) {
        int p = 0;
        p += s.getGls() * 6;
        p += s.getAst() * 4;

        int def = s.getTkl() + s.getInterceptions() + s.getBlocks();
        if (def >= 8) p += 3;
        else if (def >= 5) p += 2;

        if (s.getPassesCmp() >= 35) p++;
        if (s.getPassesCmpPct() >= 85) p++;
        if (s.getPrgp() >= 5) p++;

        p += Math.min(2, Math.round(s.getXg().floatValue() * 1.5f));
        p += Math.min(1, Math.round(s.getXag().floatValue()));

        return p;
    }

    /* ---------- MID ---------- */

    private int scoreMid(PlayerStatsView s) {
        int p = 0;
        p += s.getGls() * 5;
        p += s.getAst() * 4;

        if (s.getSca() >= 6) p += 2;
        else if (s.getSca() >= 3) p += 1;

        if (s.getGca() >= 1) p++;

        int prog = s.getPrgp() + s.getPrgc();
        if (prog >= 10) p += 2;
        else if (prog >= 6) p++;

        p += Math.min(3, Math.round(s.getXg().floatValue() * 2));
        p += Math.min(2, Math.round(s.getXag().floatValue() * 1.5f));

        int def = s.getTkl() + s.getInterceptions();
        if (def >= 7) p += 2;
        else if (def >= 4) p++;

        return p;
    }

    /* ---------- FWD ---------- */

    private int scoreFwd(PlayerStatsView s) {
        int p = 0;
        p += s.getGls() * 4;
        p += s.getAst() * 3;

        if (s.getSot() >= 3) p += 2;
        else if (s.getSot() >= 1) p++;

        if (s.getTakeonsSucc() >= 5) p += 2;
        else if (s.getTakeonsSucc() >= 3) p++;

        p += Math.min(4, Math.round(s.getXg().floatValue() * 3));
        if (s.getNpxg() >= 0.8) p++;

        if (s.getMinutes() >= 70 && s.getSh() == 0) p--;

        return p;
    }

    private int cap(int total, String pos) {
        return switch (pos) {
            case "DEF" -> Math.min(14, Math.max(-5, total));
            case "MID" -> Math.min(16, Math.max(-5, total));
            case "FWD" -> Math.min(15, Math.max(-5, total));
            default    -> Math.min(15, Math.max(-5, total));
        };
    }
}
