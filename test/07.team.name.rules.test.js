const chai = require('chai');
const expect = chai.expect;
const { runTransform } = require('./utils');

describe('7. Team name rules test:', () => {
  it('Each match should follow team name constraints (length + uniqueness + characters)', async () => {
    console.log('\n' + '='.repeat(48));

    const transformed = await runTransform();

    let sameNameCount = 0;
    let tooShortCount = 0;
    let tooLongCount = 0;
    let specialCharCount = 0;
    let emojiCount = 0;

    const minLength = 3;
    const maxLength = 30;

    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    const emojiRegex = /[\p{Emoji}]/u;

    transformed.forEach(obj => {
      const home = obj.homeTeam;
      const away = obj.awayTeam;

      // Check same name
      if (
        typeof home === 'string' &&
        typeof away === 'string' &&
        home.trim().toLowerCase() === away.trim().toLowerCase()
      ) {
        sameNameCount++;
      }

      // Check length for each field
      const teamValues = [home, away];
      let countedSpecial = false;
      let countedEmoji = false;

      teamValues.forEach(team => {
        if (typeof team !== 'string') return;

        const trimmed = team.trim();
        if (trimmed.length < minLength) tooShortCount++;
        if (trimmed.length > maxLength) tooLongCount++;

        if (!countedSpecial && specialCharRegex.test(trimmed)) {
          specialCharCount++;
          countedSpecial = true;
        }

        if (!countedEmoji && emojiRegex.test(trimmed)) {
          emojiCount++;
          countedEmoji = true;
        }
      });
    });

    const total = transformed.length;

    console.log(`Same home/away team name: ${sameNameCount}`);
    console.log(`Team names too short (< ${minLength}): ${tooShortCount}`);
    console.log(`Team names too long (> ${maxLength}): ${tooLongCount}`);
    console.log(`Team names with special chars: ${specialCharCount}`);
    console.log(`Team names with emoji: ${emojiCount}`);
    console.log(`Total matches checked: ${total}`);
    console.log('=========== Mocha’s default reporter ===================');

    const errors = [];
    if (sameNameCount > 0) errors.push(`Same team name used in ${sameNameCount} matches`);
    if (tooShortCount > 0) errors.push(`Too short team names found in ${tooShortCount} cases`);
    if (tooLongCount > 0) errors.push(`Too long team names found in ${tooLongCount} cases`);
    if (specialCharCount > 0) errors.push(`${specialCharCount} matches contain special characters in team names`);
    if (emojiCount > 0) errors.push(`${emojiCount} matches contain emoji in team names`);

    if (errors.length > 0) {
      throw new Error(errors.join('; '));
    }
  });
});
