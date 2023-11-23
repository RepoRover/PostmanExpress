import { writable } from 'svelte/store';
import { v4 } from 'uuid';

function createNotificationsStore() {
	const { subscribe, update } = writable([
		{
			type: 'info',
			title: 'New parcel comming',
			message: 'Matheus sent you a parcel',
			id: v4()
		},
		{
			type: 'success',
			title: 'Parcel status update',
			message: 'Nike Shoues from Matheus',
			status: 'delivered',
			parcel_id: '123456',
			id: v4()
		},
		{
			type: 'warning',
			title: 'Warning',
			message: 'Invalid password',
			id: v4()
		},
		{
			type: 'error',
			title: 'Error',
			message: "Couldn't create new parcel",
			id: v4()
		}
	]);

	function addNotification({
		// @ts-ignore
		type,
		// @ts-ignore
		title,
		// @ts-ignore
		message,
		// @ts-ignore
		id,
		timeout = 3000,
		status = null,
		parcel_id = null
	}) {
		// @ts-ignore
		update((notifications) => [{ type, title, message, id, status, parcel_id }, ...notifications]);
		if (timeout) {
			setTimeout(() => {
				removeNotification(id);
			}, timeout);
		}
	}

	// @ts-ignore
	function removeNotification(id) {
		// @ts-ignore
		update((notifications) => notifications.filter((t) => t.id !== id));
	}
	return {
		subscribe,
		// @ts-ignore
		info: (title, message, timeout, status, parcel_id) =>
			addNotification({
				type: 'info',
				title,
				message,
				timeout,
				status,
				parcel_id,
				id: v4()
			}),
		// @ts-ignore
		warning: (message, timeout, status, parcel_id) =>
			addNotification({
				type: 'warning',
				title: 'Warning',
				message,
				timeout,
				status,
				parcel_id,
				id: v4()
			}),
		// @ts-ignore
		error: (message, timeout, status, parcel_id) =>
			addNotification({
				type: 'error',
				title: 'Error',
				message,
				timeout,
				status,
				parcel_id,
				id: v4()
			}),
		// @ts-ignore
		success: (title, message, timeout, status, parcel_id) =>
			addNotification({
				type: 'success',
				title,
				message,
				timeout,
				status,
				parcel_id,
				id: v4()
			}),
		// @ts-ignore
		remove: (id) => removeNotification(id)
	};
}

export default createNotificationsStore();
