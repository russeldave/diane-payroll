export const orderStatusFormatter = (status_id) => {
    switch (status_id) {
      case 0:
        return 'ALL';
        break;
      case 1:
        return 'PENDING';
        break;
      case 2:
        return 'COMPLETED';
        break;
      case 7:
        return 'CANCELLED';
        break;
      default:
        return 'No Data';
        break;
    }
}

export const orderStatusClassFormatter = (status_id) => {
  switch (status_id) {
    case 0:
      return 'text-sm text-blue-500 font-semibold bg-blue-100 px-2 py-1 rounded-full';
      break;
    case 1:
      return 'text-sm text-yellow-500 font-semibold bg-yellow-100 px-2 py-1 rounded-full';
      break;
    case 2:
      return 'text-sm text-green-500 font-semibold bg-green-100 px-2 py-1 rounded-full';
      break;
    case 7:
      return 'text-sm text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full';
      break;
    default:
      return 'text-sm text-green-500 font-semibold bg-green-100 px-2 py-1 rounded-full';
      break;
  }
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
