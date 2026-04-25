// Avatar.jsx — User avatar with image or initials fallback
// Used in Navbar, TutorCard, ChatPage

const Avatar = ({ name = '', imageUrl = null, size = 'md' }) => {
  // Extract initials from the name: 'Sara Khan' → 'SK'
  const initials = name
    .split(' ')
    .map(n => n[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');

  // Size classes — sm (32px), md (40px), lg (56px)
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  // Color is deterministic from the first letter of the name.
  // Same name always gets the same color — consistent across sessions.
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500',
    'bg-red-500',  'bg-teal-500',  'bg-indigo-500', 'bg-pink-500',
  ];
  const colorIndex = (name.charCodeAt(0) || 0) % colors.length;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} ${colors[colorIndex]} rounded-full
      flex items-center justify-center flex-shrink-0 select-none`}>
      <span className="font-semibold text-white">{initials || '?'}</span>
    </div>
  );
};

export default Avatar;
