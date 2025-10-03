import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  server: {
    host: '0.0.0.0',
    port: 8000, // 기본적으로 admin dev 서버는 8000 포트를 씀
    allowedHosts: ['api.zipsise.com', 'localhost'],
  },    
  });
};
