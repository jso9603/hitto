// dream 컬렉션에서 새로운 컬렉션으로 이동
// export default moveCollectionData() {
//   const sourceCollectionRef = collection(db, 'dream'); // 원본 컬렉션
//   const targetCollectionRef = collection(db, 'automatic'); // 새로운 컬렉션

//   try {
//     // 원본 컬렉션에서 문서들을 가져옴
//     const snapshot = await getDocs(sourceCollectionRef);

//     // 배치 작업 생성
//     const batch = writeBatch(db);

//     // 각 문서를 새 컬렉션에 복사 및 원본 문서 삭제
//     snapshot.forEach((document) => {
//       const documentData = document.data();
//       const targetDocRef = doc(targetCollectionRef, document.id); // 동일한 문서 ID 사용

//       // 새 컬렉션에 데이터 설정
//       batch.set(targetDocRef, documentData);

//       // 원본 문서 삭제
//       const sourceDocRef = doc(sourceCollectionRef, document.id);
//       batch.delete(sourceDocRef);
//     });

//     // 배치 커밋
//     await batch.commit();
//     console.log('문서들이 성공적으로 이동되었습니다.');
//   } catch (error) {
//     console.error('문서를 이동하는 중 오류가 발생했습니다:', error);
//   }
// }

// type 필드가 있는 문서들은 manual 컬렉션으로 이동
// async created() {
//   const sourceCollectionRef = collection(db, 'automatic'); // 원본 컬렉션 (automatic)
//   const targetCollectionRef = collection(db, 'manual'); // 새 컬렉션 (manual)

//   try {
//     // 원본 컬렉션에서 문서들을 가져옴
//     const snapshot = await getDocs(sourceCollectionRef);

//     // 배치 작업 생성
//     const batch = writeBatch(db);

//     // 각 문서를 새 컬렉션에 복사 및 원본 문서 삭제 (필터 적용)
//     snapshot.forEach((document) => {
//       const documentData = document.data();

//       // `type` 필드가 존재하는 문서만 이동
//       if (documentData.type) {
//         const targetDocRef = doc(targetCollectionRef, document.id); // 동일한 문서 ID 사용

//         // 새 컬렉션에 데이터 설정
//         batch.set(targetDocRef, documentData);

//         // 원본 문서 삭제
//         const sourceDocRef = doc(sourceCollectionRef, document.id);
//         batch.delete(sourceDocRef);
//       }
//     });

//     // 배치 커밋
//     await batch.commit();
//     console.log('type 필드를 가진 문서들이 성공적으로 manual 컬렉션으로 이동되었습니다.');
//   } catch (error) {
//     console.error('문서를 이동하는 중 오류가 발생했습니다:', error);
//   }
// }