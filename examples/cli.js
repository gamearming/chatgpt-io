import ChatGPT from "../dist/index.js";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let bot = new ChatGPT("eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..xcvFBxjRAO1S8qpr._P7X6XLDHH-fPyeotnwxGQao0Btz8YFL-wiyfYvxtdWHYDAVwQeLRWyAv_c_RvpXNRBhRmuvFe93KwTPJ4BI7zI0rYM70jBE73QjaEPNxM1zr4inLlGc3uyzTGzNOhwpEQrrZoK1q7X3YEMxbm2tjHuw0iM0-ArTxQ7yOztl1GBp0ag8evmhzXN4k0lBIJ5dNCsPxHvJxU8piq_H6NfgTm_uObcKaxww38sxP_ffPayrfRPRNhxfTbSVVtWstxBtPaLd6kGl66qbEojzRX-mGv_mTZnDD1jcPZqUVuRirSQacwG90zvhCuS2O348eF07SbDVGllGF8O68TWtrnX9JgSOwo1EJ1sosLf-1K0OBUmQke8u6H2JM8lJVCiEQ6wfM4b7nzX3w3UVFfFAPjzMXqUjh-rejMX87tGmyoT3bJDxrJh5ctFEUjx6Wo8ViSkJXzUOEZQx6Ea4eK3-4UwyweooLxmjPvVQmTBUMU1tbbAHee4Hl9uZ9P9ZywuJdKEGqUEtvhqCueHpUxTI2L0mJ7qUJo5vMrDb59XMYvpqSb9OVNT6k1n8zPFvbGhzBNz-XeBLoAMNVrcI2RfrSznuSf5JNgKLzvkwKZP5cuJtWPTzfFX2JhioLSlnEa1A8wXutWufKz0hEtP0rq7ZcflMZimknmB9OkyV0HfprHd8ZZtYcc_odHNHlEBLIyb5OQoSaxA9hbzc-LVt6JVtsFheXpNraWaYqOTpEkHve4TBBnbsSX61uq0Ks7U6-h_r7xfdqnVbQHhVfkDL9unU61nWNgSFgB2wmWRFmbFllhkTC57pQNQwCHrtuYM4DiuOIpp8sUZPa19VRkzbQWqB7Bq1acK1Id6KqPQBf7OaaaCUPMyogZj1Z7GE0KKpOMb73X15F-SNQO_IbpnsTRjgFalsgxTPlXbV_xI2pzySbBpjOhAxHyDJbbjBOe_lbKNALP2f5u02gXf7rpG8VaazboJdAWFLWJlODf9iCk4GprwGpqzOF3d5CTnnU1rwvGdExNXgpofklytG0B1nWyr1NAsLVdF1WjDzSNJonCDqacQKP_mRfA7L5LWWZ8Ms4QjIEdlGtIsIP7MS2AAq6bPUou3MQ1Ar9abSNy_efvmMS6M1ZT-ELfZJQlkLOdzvj9TtSwI_qtUC-HLRzBEhTkHcfInLMlxwBkUjNPbH6BCY9Q0JneXMd215doHJXLNEIUI1_tLGAZR-bpA4uOikXnKXOBRsDOD9crRZoFh0-1CzfwGPNbhve64Hime5gPuK0Th7kuPtrDvkXVfyTSyitCkQedF0vNYYMSKlGgXLfFEwWL8M9eecOoncessAf4YC880DPwmaSizD7whS3JptpidzRmjY5uF7XXAcY5PTB5y-LPliQqMZHdwp3whcfLVs_YJXtx0qUs9Qp0gdFmbc2eO2OxyeubSg_Iklma1IdK38YkINxYEPclKRNsZfU3oItMLuA8RQ5SmhEjbtXdm0Rw02gjcGLfNvNqqMihZy8s-U6onn416UOswwVtgzb_R-zb1Nlz7RmMiuEpphMaam_kGDcpHG81F2WmD-VfyhfF1uvfoCQPBw9_P_DRHidxUrDa-SIsRTci1U_pnOXzHwe_YH-W-Kz0-te_IrFTF7dB79zDEnXItBov13M9mQb_8Pf6Rj4LiPnBwVT5gO3qWBA9lp8RJvfVihav39owj3m0BQL_TQB2YaeQSOgf3PGxproMlvNVxRyYW0tb5md6FI_UmrhpUqOL50dO-90bMWKEdHzjwTEbcPKFhDVLTyE_AL1yEZ1D3EBuq-j89GmLZw07twgq7y0y_6bGs_2YeKS032OIDn7mNgh5qiK_l-3VPziAp2xNVd6U777yg6r2gNy_Di9GlaFsyKfrHuAqt_7oVh68nSp8Z528kw0nstt2Jgw5JO7h4j8jo713LqYYlsd-bn3ZVldghoYwBTRRWdjOhZ9BQ5sh00k5F__QTUJGnH_cgoksBckrW5U2cb6hlBp0WHts4bwBrERecB6jDR3uY1qgT9SC3wgbSNRETn9xv9KVTdcGi9UtaQOS_5uqrs-TCxbQH8gyeapIzBHOhp7zZtD7JlQyxJvMU1buhTsilTRqU3cQ0FgSbDIXlwnW6fL7HN5xqh9p-MONgIAe3NsoaNNIDPFMS94wAtOYGhsyh3DsdA5tT38mq1UoBpaJB8wXyi8L5FaYnY0_9G_kxMR8dIhMzdmXej7l9iwfM8amm_tvKEhldKwuAhEOTnmV2TAV-H3apDH4O0rbHe32yLpTsqQwdJhHNpIw-VuvYTeTUM6CNFDag41th0JWFhCo_TJ5txaqSCKUuohHyiCFaZmsCDlIqMpTe_0rVCdyZ2rFo1WJC8CBKPfstsBeY4HzL2UUmpTjHtpUgasAK-6IfzISNgl8H2baBm_-B427yIQzCg6A6rShUMy1Bqll6zBBSZgjg15flE-lVRD5TrvRXlH7VveG0yyg1jL9ktgPfjbSBKKahEzm18kEujudXqcdHiswGZUjjW1zUynkzxYxrUC0H1_CWhglI6qW6907VwYzQgG3ixQDwvSMZvnoY82oG9Xp0YGOGedRNnAS5FdWR6hn7ewarchGVlqSwV8ECBpFYOa5xpEXxDmFtXWfOXB674sEihS8D_Pq0w.P4LCxigr5u-e3xnao0C2Cg");

/**
 * 啟動聊天程式
 * @function startChatting
 * @async
 */
async function startChatting() {
  while (true) {
    /**
     * 使用者輸入
     * @type {string}
     */
    let prompt = await new Promise((resolve) => {
      rl.question("You: ", (answer) => {
        resolve(answer);
      });
    });

    process.stdout.write("ChatGPT: ");

    /**
     * 機器人回答
     * @type {string}
     */
    await bot.askStream((chunk) => {
      process.stdout.write(chunk);
    }, prompt);

    console.log();
  }
}

startChatting();
