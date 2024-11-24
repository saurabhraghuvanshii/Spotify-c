import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
	const audioRef = useRef();
	const seekBg = useRef();
	const seekBar = useRef();

	const [track, setTrack] = useState(songsData[0]);
	const [playStatus, setPlayStatus] = useState(false);
	const [time, setTime] = useState({
		currentTime: {
			second: 0,
			minute: 0,
		},
		totalTime: {
			second: 0,
			minute: 0,
		},
	});

	const play = () => {
		audioRef.current.play();
		setPlayStatus(true);
	};

	const pause = () => {
		audioRef.current.pause();
		setPlayStatus(false);
	};

	const playWithid = async (id) => {
		await setTrack(songsData[id]);
		await audioRef.current.play();
		setPlayStatus(true);
	};

	const prev = async () => {
		if (track.id > 0) {
			await setTrack(songsData[track.id - 1]);
			await audioRef.current.play();
			setPlayStatus(true);
		}
	};

	const next = async () => {
		if (track.id < songsData.length - 1) {
			await setTrack(songsData[track.id + 1]);
			await audioRef.current.play();
			setPlayStatus(true);
		}
	};

	const seekSong = async (e) => {
		audioRef.current.currentTime =
			(e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
			audioRef.current.duration;
	};

	useEffect(() => {
		const updateTime = () => {
			if (audioRef.current) {
				const currentTime = audioRef.current.currentTime;
				const duration = audioRef.current.duration;
				seekBar.current.style.width = (currentTime / duration) * 100 + "%";
				setTime({
					currentTime: {
						second: Math.floor(currentTime % 60),
						minute: Math.floor(currentTime / 60),
					},
					totalTime: {
						second: Math.floor(duration % 60),
						minute: Math.floor(duration / 60),
					},
				});
			}
		};
		if (audioRef.current) {
			audioRef.current.addEventListener("timeupdate", updateTime);
			return () => {
				audioRef.current.removeEventListener("timeupdate", updateTime);
			};
		}
	}, [audioRef]);

	const contextValue = {
		audioRef,
		seekBar,
		seekBg,
		track,
		setTrack,
		playStatus,
		setPlayStatus,
		time,
		setTime,
		play,
		pause,
		playWithid,
		prev,
		next,
		seekSong,
	};

	return (
		<PlayerContext.Provider value={contextValue}>
			{props.children}
		</PlayerContext.Provider>
	);
};

export default PlayerContextProvider;
