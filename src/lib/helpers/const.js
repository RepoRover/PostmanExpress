export const statusMap = {
	'awaiting drop-off': 'awaiting-drop-off',
	'prepared for delivery': 'prepared-for-delivery',
	'at warehouse': 'at-warehouse',
	'en route': 'en-route',
	'en route to the pickup location': 'en-route',
	'en route to the warehouse': 'en-route',
	'ready for pickup': 'ready-for-pick-up',
	delivered: 'delivered'
};

export const protectedRoutes = ['/parcels/new', '/parcels/history'];
