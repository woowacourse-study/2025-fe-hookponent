import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// Node.js 환경에서 실행되므로 브라우저 API나 JSX는 사용하지 마세요

const config: Config = {
  title: 'Hookponent', // 사이트 제목
  favicon: 'img/favicon.ico', // 파비콘 경로

  future: {
    v4: true, // Docusaurus v4 호환 설정
  },

  url: 'https://your-docusaurus-site.example.com', // 나중에 Vercel 배포 시 실제 도메인으로 수정
  baseUrl: '/', // 기본 경로

  onBrokenLinks: 'throw', // 깨진 링크 발견 시 오류 발생
  onBrokenMarkdownLinks: 'warn', // 마크다운 링크 오류는 경고만

  i18n: {
    defaultLocale: 'ko', // 기본 언어
    locales: ['ko'], // 사용 언어
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts', // 사이드바 설정 파일
        },
        blog: false, // 블로그 기능 사용 안 함
        theme: {
          customCss: './src/css/custom.css', // 커스텀 스타일 (없으면 삭제해도 됨)
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg', // 메타 이미지

    // 상단 네비게이션 바 설정
    navbar: {
      title: 'Hookponent',
      logo: {
        alt: 'hookdle 로고',
        src: 'img/hookponent-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '문서',
        },
        {
          to: '/introduce',
          label: '기타',
          position: 'left',
        },
        {
          href: 'https://github.com/woowacourse-study/2025-fe-hookdle',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    // 하단 푸터 설정
    footer: {
      style: 'dark',
      links: [
        {
          title: '문서',
          items: [
            {
              label: '시작하기',
              to: '/docs/getStarted',
            },
            {
              label: 'hooks',
              to: '/docs/hooks',
            },
            {
              label: 'components',
              to: '/docs/components',
            },
          ],
        },
        {
          title: '기타',
          items: [
            {
              label: '스터디 소개',
              to: '/introduce',
            },
          ],
        },
        {
          title: '기타',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/woowacourse-study/2025-fe-hookdle',
            },
            {
              label: 'npm (hookdle)',
              href: 'https://www.npmjs.com/package/hookdle',
            },
            {
              label: 'npm (componentdle)',
              href: 'https://www.npmjs.com/package/componentdle',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} hookdle. Built with woowacourse-7th.`,
    },

    // 코드 하이라이팅 테마 설정
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
