import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
for (const dir of ['api', 'assets/js', 'lib']) {
  for (const name of readdirSync(dir).filter(name => name.endsWith('.js'))) {
    const file = `${dir}/${name}`;
    const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
    console.log(`Syntax OK: ${file}`);
  }
}
