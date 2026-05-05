import { router } from '@inertiajs/react';

export default function BookNow({ resource }) {
  const submit = (e) => {
    e.preventDefault();

    router.post('/reservations', {
      resource_id: resource.id,
      start_time: '2026-05-05 10:00:00',
      end_time: '2026-05-05 11:00:00',
    });
  };

  return (
    <button onClick={submit}>
      Book Now
    </button>
  );
}