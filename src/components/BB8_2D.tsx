"use client";

import styles from "./BB8_2D.module.css";

export function BB8_2D() {
	return (
		<div className={styles.container}>
			<div className={styles.bb8}>
				<div className={styles.head}>
					<div className={styles.antenna} />
					<div className={styles.antennaLonger} />
					<div className={styles.headTop}>
						<div className={styles.barGray} />
						<div className={styles.barRed} />
						<div className={styles.lens}>
							<div className={styles.lensInner} />
						</div>
						<div className={styles.lensSecondary}>
							<div className={styles.lensSecondaryInner} />
						</div>
						<div className={styles.barRedLowerLeft} />
						<div className={styles.barRedLowerRight} />
						<div className={styles.barGrayLower} />
					</div>
					<div className={styles.joint} />
				</div>
				<div className={styles.headShadow} />
				<div className={styles.body}>
					<div className={styles.circleOne}>
						<div className={styles.circleOneBarOne} />
						<div className={styles.circleOneBarTwo} />
						<div className={styles.circleOneInnerCircle} />
						<div className={styles.circleOneInnerBorder} />
					</div>
					<div className={styles.circleTwo}>
						<div className={styles.circleTwoBarOne} />
						<div className={styles.circleTwoInnerBorder} />
					</div>
					<div className={styles.circleThree}>
						<div className={styles.circleThreeBarOne} />
						<div className={styles.circleThreeBarTwo} />
						<div className={styles.circleThreeInnerCircle} />
						<div className={styles.circleThreeInnerBorder} />
					</div>
					<div className={styles.lineOne} />
					<div className={styles.lineTwo} />
					<div className={styles.lineThree} />
					<div className={styles.screwOne} />
					<div className={styles.screwTwo} />
					<div className={styles.screwThree} />
					<div className={styles.screwFour} />
					<div className={styles.screwFive} />
					<div className={styles.screwSix} />
				</div>
				<div className={styles.bodyShadow} />
			</div>
		</div>
	);
}
