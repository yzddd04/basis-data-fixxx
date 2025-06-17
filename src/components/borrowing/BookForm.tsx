const filteredMembers = anggota.filter(member =>
  member.status_aktif === 'aktif' &&
  ((member.nama_lengkap?.toLowerCase() || '').includes(memberSearch.toLowerCase()) ||
  (member.nomor_anggota?.toLowerCase() || '').includes(memberSearch.toLowerCase()))
); 