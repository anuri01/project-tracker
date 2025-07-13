import { useState, useEffect, useRef, useCallback } from 'react';

function useElementSize() {
  // 1. 크기를 측정할 DOM 요소를 가리킬 ref 생성
  const ref = useRef(null);

  // 2. 측정된 크기를 저장할 state 생성
  const [size, setSize] = useState({ width: 0, height: 0 });

  // 3. ResizeObserver 콜백 함수 생성
  // useCallback으로 감싸서 불필요한 재생성을 방지
  const handleResize = useCallback(([entry]) => {
    // entry.contentRect를 통해 요소의 크기 정보를 받아와 state 업데이트
    setSize({
      width: entry.contentRect.width,
      height: entry.contentRect.height,
    });
  }, []);

  useEffect(() => {
    // 4. ref.current (DOM 요소)가 있을 때만 실행
    if (ref.current) {
      // 5. ResizeObserver 인스턴스 생성 및 콜백 함수 등록
      const observer = new ResizeObserver(handleResize);
      // ref.current 요소의 크기 변경 감시 시작
      observer.observe(ref.current);

      // 6. 클린업: 컴포넌트가 사라질 때 감시를 중단
      return () => observer.disconnect();
    }
  }, [ref, handleResize]); // ref나 handleResize 함수가 바뀔 때만 useEffect 재실행

  // 7. DOM 요소를 연결할 ref와 측정된 size를 반환
  return [ref, size];
}

export default useElementSize;