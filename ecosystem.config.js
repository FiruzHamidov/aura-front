apps: [{
    name: 'aura-fro',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p ' + (process.env.PORT || 3001),
    instances: 'max',
    exec_mode: 'cluster',
    env: { PORT: 3001 },
    env_production: { PORT: 3001 }
}]