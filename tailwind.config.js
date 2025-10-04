/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	safelist: [
		...Array.from({ length: 101 }, (_, i) => `top-[${i * 10}px]`),
		...Array.from({ length: 101 }, (_, i) => `left-[${i * 10}px]`),

		'bg-status-secured-coverage',
		'bg-status-pending-coverage',
		'bg-status-sent-product',
		'bg-status-scheduled',
		'bg-status-cancelled',
		'bg-status-not-fit',
		'bg-status-client-declined',
		'bg-status-media-declined',
		'bg-status-unresponsive',
		'bg-status-product-request',
		'bg-status-waiting-to-go-live',
		'bg-status-paid',
		'bg-status-pitched-dream-media',
		'bg-status-prospect',
		'bg-status-warm-lead',
		'bg-status-future-consideration',
		'bg-status-live'
	],
	theme: {
		extend: {
			colors: {
				primary: {
					50: '#BDCBFF',
					100: '#8AA3FF',
					500: '#577BFF',
					600: '#2454FF',
					700: '#0035F0',
					800: '#0029BD'
				},
				secondary: {
					50: '#F2FFB2',
					100: '#E9FF80',
					500: '#E0FF4D',
					600: '#D2FF00',
					700: '#D7FF1A',
					800: '#BDE500'
				},
				alerts: {
					success: '#4DF000',
					info: '#00A8F0',
					warning: '#F0D800',
					error: '#FF1F00',
					disabled: '#F0F0F0'
				},
				dark: {
					1: '#292929',
					2: '#333333',
					3: '#424242',
					4: '#5C5C5C',
					5: '#757575'
				},
				light: {
					1: '#8F8F8F',
					2: '#A8A8A8',
					3: '#C2C2C2',
					4: '#DBDBDB',
					5: '#F5F5F5'
				},
				status: {
					'secured-coverage': '#8AA3FF66',
					'pending-coverage': '#E5E9F0',
					'sent-product': '#79EBE166',
					scheduled: '#8FFF9566',
					cancelled: '#FF24244D',
					'not-fit': '#FED5E099',
					'client-declined': '#A825E666',
					'media-declined': '#FF24244D',
					unresponsive: '#8AA3FF66',
					'product-request': '#2454FF66',
					'waiting-to-go-live': '#8BDCFD99',
					paid: '#79EBE199',
					'pitched-dream-media': '#9CDF9899',
					prospect: '#8AA3FF66',
					'warm-lead': '#247CFF66',
					'future-consideration': '#DBDBDB99',
					live: '#79EBE199'
				},
				rtag: {}
			}
		}
	},
	plugins: []
}
