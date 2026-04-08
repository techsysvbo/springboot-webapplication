import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { BIBLE_BOOKS } from './bibleBooks';

const prisma = new PrismaClient();

interface VerseData {
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
  topics?: string[];
}

const KJV_VERSES: VerseData[] = [
  // Genesis
  { bookId: 1, chapter: 1, verse: 1, text: 'In the beginning God created the heaven and the earth.', topics: ['Creation', 'God'] },
  { bookId: 1, chapter: 1, verse: 2, text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.', topics: ['Creation', 'Holy Spirit'] },
  { bookId: 1, chapter: 1, verse: 3, text: 'And God said, Let there be light: and there was light.', topics: ['Creation', 'God'] },
  { bookId: 1, chapter: 1, verse: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.', topics: ['Creation', 'God'] },
  { bookId: 1, chapter: 1, verse: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.', topics: ['Creation', 'God', 'Family'] },
  { bookId: 1, chapter: 2, verse: 24, text: 'Therefore shall a man leave his father and his mother, and shall cleave unto his wife: and they shall be one flesh.', topics: ['Marriage', 'Family'] },
  { bookId: 1, chapter: 3, verse: 15, text: 'And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.', topics: ['Redemption', 'Jesus'] },
  { bookId: 1, chapter: 15, verse: 6, text: 'And he believed in the LORD; and he counted it to him for righteousness.', topics: ['Faith'] },
  // Exodus
  { bookId: 2, chapter: 14, verse: 14, text: 'The LORD shall fight for you, and ye shall hold your peace.', topics: ['Faith', 'God'] },
  { bookId: 2, chapter: 20, verse: 3, text: 'Thou shalt have no other gods before me.', topics: ['Obedience', 'God', 'Worship'] },
  { bookId: 2, chapter: 20, verse: 12, text: 'Honour thy father and thy mother: that thy days may be long upon the land which the LORD thy God giveth thee.', topics: ['Family', 'Obedience'] },
  // Deuteronomy
  { bookId: 5, chapter: 6, verse: 4, text: 'Hear, O Israel: The LORD our God is one LORD:', topics: ['God', 'Worship'] },
  { bookId: 5, chapter: 6, verse: 5, text: 'And thou shalt love the LORD thy God with all thine heart, and with all thy soul, and with all thy might.', topics: ['Love', 'Worship', 'God'] },
  { bookId: 5, chapter: 31, verse: 6, text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.', topics: ['Strength', 'Fear', 'God'] },
  // Joshua
  { bookId: 6, chapter: 1, verse: 8, text: 'This book of the law shall not depart out of thy mouth; but thou shalt meditate therein day and night, that thou mayest observe to do according to all that is written therein: for then thou shalt make thy way prosperous, and then thou shalt have good success.', topics: ['Bible', 'Obedience', 'Wisdom'] },
  { bookId: 6, chapter: 1, verse: 9, text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', topics: ['Strength', 'Fear', 'God'] },
  { bookId: 6, chapter: 24, verse: 15, text: 'And if it seem evil unto you to serve the LORD, choose you this day whom ye will serve; whether the gods which your fathers served that were on the other side of the flood, or the gods of the Amorites, in whose land ye dwell: but as for me and my house, we will serve the LORD.', topics: ['Obedience', 'Family', 'Worship'] },
  // Psalms
  { bookId: 19, chapter: 1, verse: 1, text: 'Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.', topics: ['Wisdom', 'Obedience'] },
  { bookId: 19, chapter: 23, verse: 1, text: 'The LORD is my shepherd; I shall not want.', topics: ['God', 'Peace', 'Faith'] },
  { bookId: 19, chapter: 23, verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.', topics: ['Peace', 'God'] },
  { bookId: 19, chapter: 23, verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.', topics: ['God', 'Healing'] },
  { bookId: 19, chapter: 23, verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.', topics: ['Fear', 'God', 'Peace'] },
  { bookId: 19, chapter: 23, verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.', topics: ['God', 'Worship'] },
  { bookId: 19, chapter: 23, verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.', topics: ['God', 'Heaven', 'Hope'] },
  { bookId: 19, chapter: 27, verse: 1, text: 'The LORD is my light and my salvation; whom shall I fear? the LORD is the strength of my life; of whom shall I be afraid?', topics: ['Salvation', 'Fear', 'Strength'] },
  { bookId: 19, chapter: 34, verse: 18, text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.', topics: ['God', 'Healing', 'Salvation'] },
  { bookId: 19, chapter: 37, verse: 4, text: 'Delight thyself also in the LORD: and he shall give thee the desires of thine heart.', topics: ['God', 'Faith', 'Prayer'] },
  { bookId: 19, chapter: 46, verse: 1, text: 'God is our refuge and strength, a very present help in trouble.', topics: ['Strength', 'God', 'Fear'] },
  { bookId: 19, chapter: 46, verse: 10, text: 'Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.', topics: ['God', 'Peace', 'Worship'] },
  { bookId: 19, chapter: 91, verse: 1, text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.', topics: ['God', 'Peace', 'Fear'] },
  { bookId: 19, chapter: 91, verse: 2, text: 'I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.', topics: ['God', 'Faith'] },
  { bookId: 19, chapter: 103, verse: 2, text: 'Bless the LORD, O my soul, and forget not all his benefits:', topics: ['Worship', 'God'] },
  { bookId: 19, chapter: 103, verse: 3, text: 'Who forgiveth all thine iniquities; who healeth all thy diseases;', topics: ['Forgiveness', 'Healing', 'God'] },
  { bookId: 19, chapter: 118, verse: 24, text: 'This is the day which the LORD hath made; we will rejoice and be glad in it.', topics: ['Worship', 'God'] },
  { bookId: 19, chapter: 119, verse: 105, text: 'Thy word is a lamp unto my feet, and a light unto my path.', topics: ['Bible', 'Wisdom', 'God'] },
  { bookId: 19, chapter: 139, verse: 14, text: 'I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.', topics: ['God', 'Creation', 'Worship'] },
  // Proverbs
  { bookId: 20, chapter: 3, verse: 5, text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.', topics: ['Faith', 'Wisdom', 'God'] },
  { bookId: 20, chapter: 3, verse: 6, text: 'In all thy ways acknowledge him, and he shall direct thy paths.', topics: ['Faith', 'Wisdom', 'God'] },
  { bookId: 20, chapter: 4, verse: 7, text: 'Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.', topics: ['Wisdom'] },
  { bookId: 20, chapter: 11, verse: 2, text: 'When pride cometh, then cometh shame: but with the lowly is wisdom.', topics: ['Wisdom'] },
  { bookId: 20, chapter: 16, verse: 3, text: 'Commit thy works unto the LORD, and thy thoughts shall be established.', topics: ['Faith', 'God'] },
  { bookId: 20, chapter: 17, verse: 22, text: 'A merry heart doeth good like a medicine: but a broken spirit drieth the bones.', topics: ['Healing', 'Wisdom'] },
  { bookId: 20, chapter: 22, verse: 6, text: 'Train up a child in the way he should go: and when he is old, he will not depart from it.', topics: ['Family', 'Wisdom'] },
  { bookId: 20, chapter: 31, verse: 10, text: 'Who can find a virtuous woman? for her price is far above rubies.', topics: ['Family', 'Marriage'] },
  // Ecclesiastes
  { bookId: 21, chapter: 3, verse: 1, text: 'To every thing there is a season, and a time to every purpose under the heaven:', topics: ['Wisdom', 'God'] },
  { bookId: 21, chapter: 12, verse: 13, text: 'Let us hear the conclusion of the whole matter: Fear God, and keep his commandments: for this is the whole duty of man.', topics: ['Obedience', 'Fear', 'God'] },
  // Isaiah
  { bookId: 23, chapter: 7, verse: 14, text: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.', topics: ['Jesus', 'Prophecy'] },
  { bookId: 23, chapter: 9, verse: 6, text: 'For unto us a child is born, unto us a son is given: and the government shall be upon his shoulder: and his name shall be called Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace.', topics: ['Jesus', 'Prophecy', 'Peace'] },
  { bookId: 23, chapter: 40, verse: 28, text: 'Hast thou not known? hast thou not heard, that the everlasting God, the LORD, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding.', topics: ['God', 'Strength'] },
  { bookId: 23, chapter: 40, verse: 29, text: 'He giveth power to the faint; and to them that have no might he increaseth strength.', topics: ['Strength', 'God'] },
  { bookId: 23, chapter: 40, verse: 31, text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.', topics: ['Strength', 'Hope', 'God'] },
  { bookId: 23, chapter: 41, verse: 10, text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.', topics: ['Fear', 'Strength', 'God'] },
  { bookId: 23, chapter: 53, verse: 5, text: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.', topics: ['Jesus', 'Healing', 'Redemption', 'Salvation'] },
  { bookId: 23, chapter: 53, verse: 6, text: 'All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all.', topics: ['Sin', 'Salvation', 'Jesus'] },
  // Jeremiah
  { bookId: 24, chapter: 29, verse: 11, text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.', topics: ['Hope', 'Peace', 'God'] },
  { bookId: 24, chapter: 29, verse: 12, text: 'Then shall ye call upon me, and ye shall go and pray unto me, and I will hearken unto you.', topics: ['Prayer', 'God'] },
  { bookId: 24, chapter: 29, verse: 13, text: 'And ye shall seek me, and find me, when ye shall search for me with all your heart.', topics: ['Prayer', 'God', 'Faith'] },
  { bookId: 24, chapter: 31, verse: 3, text: 'The LORD hath appeared of old unto me, saying, Yea, I have loved thee with an everlasting love; therefore with lovingkindness have I drawn thee.', topics: ['Love', 'God'] },
  // Ezekiel
  { bookId: 26, chapter: 36, verse: 26, text: 'A new heart also will I give you, and a new spirit will I put within you: and I will take away the stony heart out of your flesh, and I will give you an heart of flesh.', topics: ['Holy Spirit', 'Redemption', 'God'] },
  // Daniel
  { bookId: 27, chapter: 6, verse: 10, text: 'Now when Daniel knew that the writing was signed, he went into his house; and his windows being open in his chamber toward Jerusalem, he kneeled upon his knees three times a day, and prayed, and gave thanks before his God, as he did aforetime.', topics: ['Prayer', 'Faith'] },
  // Micah
  { bookId: 33, chapter: 6, verse: 8, text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?', topics: ['Obedience', 'God', 'Wisdom'] },
  // Habakkuk
  { bookId: 35, chapter: 2, verse: 4, text: 'Behold, his soul which is lifted up is not upright in him: but the just shall live by his faith.', topics: ['Faith'] },
  // Malachi
  { bookId: 39, chapter: 3, verse: 10, text: 'Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.', topics: ['Money', 'Worship', 'God'] },
  // Matthew
  { bookId: 40, chapter: 5, verse: 3, text: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.', topics: ['Heaven', 'Salvation'] },
  { bookId: 40, chapter: 5, verse: 4, text: 'Blessed are they that mourn: for they shall be comforted.', topics: ['Peace', 'Heaven'] },
  { bookId: 40, chapter: 5, verse: 5, text: 'Blessed are the meek: for they shall inherit the earth.', topics: ['Heaven'] },
  { bookId: 40, chapter: 5, verse: 6, text: 'Blessed are they which do hunger and thirst after righteousness: for they shall be filled.', topics: ['Heaven', 'Salvation'] },
  { bookId: 40, chapter: 5, verse: 7, text: 'Blessed are the merciful: for they shall obtain mercy.', topics: ['Forgiveness', 'Heaven'] },
  { bookId: 40, chapter: 5, verse: 8, text: 'Blessed are the pure in heart: for they shall see God.', topics: ['Heaven', 'God'] },
  { bookId: 40, chapter: 5, verse: 9, text: 'Blessed are the peacemakers: for they shall be called the children of God.', topics: ['Peace', 'Heaven', 'God'] },
  { bookId: 40, chapter: 5, verse: 10, text: 'Blessed are they which are persecuted for righteousness\' sake: for theirs is the kingdom of heaven.', topics: ['Heaven', 'Faith'] },
  { bookId: 40, chapter: 5, verse: 11, text: 'Blessed are ye, when men shall revile you, and persecute you, and shall say all manner of evil against you falsely, for my sake.', topics: ['Faith', 'Heaven'] },
  { bookId: 40, chapter: 5, verse: 12, text: 'Rejoice, and be exceeding glad: for great is your reward in heaven: for so persecuted they the prophets which were before you.', topics: ['Heaven', 'Hope'] },
  { bookId: 40, chapter: 5, verse: 16, text: 'Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.', topics: ['Worship', 'God'] },
  { bookId: 40, chapter: 6, verse: 9, text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.', topics: ['Prayer', 'God', 'Worship'] },
  { bookId: 40, chapter: 6, verse: 10, text: 'Thy kingdom come. Thy will be done in earth, as it is in heaven.', topics: ['Prayer', 'Heaven', 'God'] },
  { bookId: 40, chapter: 6, verse: 11, text: 'Give us this day our daily bread.', topics: ['Prayer', 'God'] },
  { bookId: 40, chapter: 6, verse: 12, text: 'And forgive us our debts, as we forgive our debtors.', topics: ['Prayer', 'Forgiveness'] },
  { bookId: 40, chapter: 6, verse: 13, text: 'And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.', topics: ['Prayer', 'God'] },
  { bookId: 40, chapter: 6, verse: 19, text: 'Lay not up for yourselves treasures upon earth, where moth and rust doth corrupt, and where thieves break through and steal:', topics: ['Money', 'Wisdom'] },
  { bookId: 40, chapter: 6, verse: 20, text: 'But lay up for yourselves treasures in heaven, where neither moth nor rust doth corrupt, and where thieves do not break through nor steal:', topics: ['Money', 'Heaven', 'Wisdom'] },
  { bookId: 40, chapter: 6, verse: 33, text: 'But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.', topics: ['Faith', 'God', 'Obedience'] },
  { bookId: 40, chapter: 11, verse: 28, text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest.', topics: ['Jesus', 'Peace', 'Salvation'] },
  { bookId: 40, chapter: 11, verse: 29, text: 'Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls.', topics: ['Jesus', 'Peace'] },
  { bookId: 40, chapter: 16, verse: 18, text: 'And I say also unto thee, That thou art Peter, and upon this rock I will build my church; and the gates of hell shall not prevail against it.', topics: ['Jesus', 'God'] },
  { bookId: 40, chapter: 22, verse: 37, text: 'Jesus said unto him, Thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind.', topics: ['Love', 'God', 'Obedience'] },
  { bookId: 40, chapter: 22, verse: 39, text: 'And the second is like unto it, Thou shalt love thy neighbour as thyself.', topics: ['Love', 'Obedience'] },
  { bookId: 40, chapter: 28, verse: 19, text: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:', topics: ['Jesus', 'Holy Spirit', 'God'] },
  { bookId: 40, chapter: 28, verse: 20, text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you alway, even unto the end of the world. Amen.', topics: ['Jesus', 'God', 'Obedience'] },
  // Mark
  { bookId: 41, chapter: 10, verse: 27, text: 'And Jesus looking upon them saith, With men it is impossible, but not with God: for with God all things are possible.', topics: ['God', 'Miracles', 'Faith'] },
  { bookId: 41, chapter: 11, verse: 24, text: 'Therefore I say unto you, What things soever ye desire, when ye pray, believe that ye receive them, and ye shall have them.', topics: ['Prayer', 'Faith'] },
  { bookId: 41, chapter: 16, verse: 15, text: 'And he said unto them, Go ye into all the world, and preach the gospel to every creature.', topics: ['Jesus', 'Salvation'] },
  // Luke
  { bookId: 42, chapter: 1, verse: 37, text: 'For with God nothing shall be impossible.', topics: ['God', 'Miracles', 'Faith'] },
  { bookId: 42, chapter: 6, verse: 31, text: 'And as ye would that men should do to you, do ye also to them likewise.', topics: ['Love', 'Wisdom', 'Obedience'] },
  { bookId: 42, chapter: 6, verse: 38, text: 'Give, and it shall be given unto you; good measure, pressed down, and shaken together, and running over, shall men give into your bosom. For with the same measure that ye mete withal it shall be measured to you again.', topics: ['Money', 'Wisdom', 'God'] },
  { bookId: 42, chapter: 17, verse: 21, text: 'Neither shall they say, Lo here! or, lo there! for, behold, the kingdom of God is within you.', topics: ['God', 'Heaven'] },
  // John
  { bookId: 43, chapter: 1, verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.', topics: ['Jesus', 'God', 'Bible'] },
  { bookId: 43, chapter: 1, verse: 2, text: 'The same was in the beginning with God.', topics: ['Jesus', 'God'] },
  { bookId: 43, chapter: 1, verse: 3, text: 'All things were made by him; and without him was not any thing made that was made.', topics: ['Jesus', 'Creation', 'God'] },
  { bookId: 43, chapter: 1, verse: 4, text: 'In him was life; and the life was the light of men.', topics: ['Jesus', 'Eternal Life'] },
  { bookId: 43, chapter: 1, verse: 5, text: 'And the light shineth in darkness; and the darkness comprehended it not.', topics: ['Jesus'] },
  { bookId: 43, chapter: 1, verse: 6, text: 'There was a man sent from God, whose name was John.', topics: ['Jesus', 'God'] },
  { bookId: 43, chapter: 1, verse: 7, text: 'The same came for a witness, to bear witness of the Light, that all men through him might believe.', topics: ['Faith', 'Jesus'] },
  { bookId: 43, chapter: 1, verse: 8, text: 'He was not that Light, but was sent to bear witness of that Light.', topics: ['Jesus'] },
  { bookId: 43, chapter: 1, verse: 9, text: 'That was the true Light, which lighteth every man that cometh into the world.', topics: ['Jesus'] },
  { bookId: 43, chapter: 1, verse: 10, text: 'He was in the world, and the world was made by him, and the world knew him not.', topics: ['Jesus', 'Creation'] },
  { bookId: 43, chapter: 1, verse: 11, text: 'He came unto his own, and his own received him not.', topics: ['Jesus'] },
  { bookId: 43, chapter: 1, verse: 12, text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:', topics: ['Jesus', 'Salvation', 'Faith'] },
  { bookId: 43, chapter: 1, verse: 13, text: 'Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.', topics: ['Salvation', 'God'] },
  { bookId: 43, chapter: 1, verse: 14, text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.', topics: ['Jesus', 'Grace', 'God'] },
  { bookId: 43, chapter: 3, verse: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.', topics: ['Salvation', 'Jesus', 'Heaven'] },
  { bookId: 43, chapter: 3, verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', topics: ['Love', 'Salvation', 'Eternal Life', 'Jesus', 'God'] },
  { bookId: 43, chapter: 3, verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.', topics: ['Salvation', 'Jesus', 'God'] },
  { bookId: 43, chapter: 8, verse: 31, text: 'Then said Jesus to those Jews which believed on him, If ye continue in my word, then are ye my disciples indeed;', topics: ['Jesus', 'Bible', 'Obedience'] },
  { bookId: 43, chapter: 8, verse: 32, text: 'And ye shall know the truth, and the truth shall make you free.', topics: ['Jesus', 'Salvation'] },
  { bookId: 43, chapter: 10, verse: 10, text: 'The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.', topics: ['Jesus', 'Eternal Life', 'Salvation'] },
  { bookId: 43, chapter: 11, verse: 25, text: 'Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live:', topics: ['Jesus', 'Eternal Life', 'Salvation'] },
  { bookId: 43, chapter: 13, verse: 34, text: 'A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.', topics: ['Love', 'Jesus', 'Obedience'] },
  { bookId: 43, chapter: 14, verse: 1, text: 'Let not your heart be troubled: ye believe in God, believe also in me.', topics: ['Peace', 'Faith', 'Jesus'] },
  { bookId: 43, chapter: 14, verse: 6, text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.', topics: ['Jesus', 'Salvation', 'Eternal Life'] },
  { bookId: 43, chapter: 14, verse: 27, text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.', topics: ['Peace', 'Jesus', 'Fear'] },
  { bookId: 43, chapter: 15, verse: 5, text: 'I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing.', topics: ['Jesus', 'Faith', 'Obedience'] },
  { bookId: 43, chapter: 15, verse: 13, text: 'Greater love hath no man than this, that a man lay down his life for his friends.', topics: ['Love', 'Jesus'] },
  { bookId: 43, chapter: 16, verse: 33, text: 'These things I have spoken unto you, that in me ye might have peace. In the world ye shall have tribulation: but be of good cheer; I have overcome the world.', topics: ['Peace', 'Jesus', 'Hope'] },
  // Acts
  { bookId: 44, chapter: 1, verse: 8, text: 'But ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Judaea, and in Samaria, and unto the uttermost part of the earth.', topics: ['Holy Spirit', 'Jesus'] },
  { bookId: 44, chapter: 4, verse: 12, text: 'Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.', topics: ['Salvation', 'Jesus'] },
  // Romans
  { bookId: 45, chapter: 3, verse: 23, text: 'For all have sinned, and come short of the glory of God;', topics: ['Sin', 'Salvation'] },
  { bookId: 45, chapter: 5, verse: 1, text: 'Therefore being justified by faith, we have peace with God through our Lord Jesus Christ:', topics: ['Faith', 'Peace', 'Salvation', 'Jesus'] },
  { bookId: 45, chapter: 5, verse: 8, text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.', topics: ['Love', 'Salvation', 'Jesus', 'God'] },
  { bookId: 45, chapter: 6, verse: 23, text: 'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.', topics: ['Sin', 'Eternal Life', 'Salvation', 'Jesus'] },
  { bookId: 45, chapter: 8, verse: 1, text: 'There is therefore now no condemnation to them which are in Christ Jesus, who walk not after the flesh, but after the Spirit.', topics: ['Salvation', 'Jesus', 'Holy Spirit'] },
  { bookId: 45, chapter: 8, verse: 28, text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.', topics: ['God', 'Hope', 'Faith'] },
  { bookId: 45, chapter: 8, verse: 38, text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,', topics: ['Love', 'God', 'Eternal Life'] },
  { bookId: 45, chapter: 8, verse: 39, text: 'Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.', topics: ['Love', 'God', 'Jesus'] },
  { bookId: 45, chapter: 10, verse: 9, text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.', topics: ['Salvation', 'Jesus', 'Faith'] },
  { bookId: 45, chapter: 10, verse: 10, text: 'For with the heart man believeth unto righteousness; and with the mouth confession is made unto salvation.', topics: ['Salvation', 'Faith'] },
  { bookId: 45, chapter: 12, verse: 1, text: 'I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.', topics: ['Worship', 'God', 'Obedience'] },
  { bookId: 45, chapter: 12, verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.', topics: ['Obedience', 'God', 'Wisdom'] },
  // 1 Corinthians
  { bookId: 46, chapter: 10, verse: 13, text: 'There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it.', topics: ['God', 'Faith', 'Strength'] },
  { bookId: 46, chapter: 13, verse: 4, text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,', topics: ['Love'] },
  { bookId: 46, chapter: 13, verse: 5, text: 'Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;', topics: ['Love'] },
  { bookId: 46, chapter: 13, verse: 6, text: 'Rejoiceth not in iniquity, but rejoiceth in the truth;', topics: ['Love'] },
  { bookId: 46, chapter: 13, verse: 7, text: 'Beareth all things, believeth all things, hopeth all things, endureth all things.', topics: ['Love', 'Hope', 'Faith'] },
  { bookId: 46, chapter: 13, verse: 13, text: 'And now abideth faith, hope, charity, these three; but the greatest of these is charity.', topics: ['Love', 'Hope', 'Faith'] },
  { bookId: 46, chapter: 15, verse: 55, text: 'O death, where is thy sting? O grave, where is thy victory?', topics: ['Eternal Life', 'Salvation', 'Hope'] },
  { bookId: 46, chapter: 15, verse: 57, text: 'But thanks be to God, which giveth us the victory through our Lord Jesus Christ.', topics: ['Salvation', 'God', 'Jesus'] },
  // 2 Corinthians
  { bookId: 47, chapter: 5, verse: 17, text: 'Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.', topics: ['Salvation', 'Jesus', 'Redemption'] },
  { bookId: 47, chapter: 5, verse: 21, text: 'For he hath made him to be sin for us, who knew no sin; that we might be made the righteousness of God in him.', topics: ['Salvation', 'Jesus', 'Sin', 'Redemption'] },
  { bookId: 47, chapter: 9, verse: 7, text: 'Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.', topics: ['Money', 'God', 'Wisdom'] },
  { bookId: 47, chapter: 12, verse: 9, text: 'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.', topics: ['Grace', 'Strength', 'God'] },
  // Galatians
  { bookId: 48, chapter: 2, verse: 20, text: 'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.', topics: ['Jesus', 'Faith', 'Salvation'] },
  { bookId: 48, chapter: 5, verse: 22, text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith,', topics: ['Holy Spirit', 'Love', 'Peace'] },
  { bookId: 48, chapter: 5, verse: 23, text: 'Meekness, temperance: against such there is no law.', topics: ['Holy Spirit'] },
  { bookId: 48, chapter: 6, verse: 7, text: 'Be not deceived; God is not mocked: for whatsoever a man soweth, that shall he also reap.', topics: ['God', 'Wisdom', 'Obedience'] },
  // Ephesians
  { bookId: 49, chapter: 2, verse: 8, text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:', topics: ['Grace', 'Salvation', 'Faith'] },
  { bookId: 49, chapter: 2, verse: 9, text: 'Not of works, lest any man should boast.', topics: ['Grace', 'Salvation'] },
  { bookId: 49, chapter: 2, verse: 10, text: 'For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.', topics: ['God', 'Creation', 'Obedience'] },
  { bookId: 49, chapter: 4, verse: 32, text: 'And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.', topics: ['Forgiveness', 'Love', 'God'] },
  { bookId: 49, chapter: 6, verse: 11, text: 'Put on the whole armour of God, that ye may be able to stand against the wiles of the devil.', topics: ['Strength', 'God', 'Faith'] },
  { bookId: 49, chapter: 6, verse: 12, text: 'For we wrestle not against flesh and blood, but against principalities, against powers, against the rulers of the darkness of this world, against spiritual wickedness in high places.', topics: ['Strength', 'Faith'] },
  // Philippians
  { bookId: 50, chapter: 4, verse: 4, text: 'Rejoice in the Lord alway: and again I say, Rejoice.', topics: ['God', 'Worship'] },
  { bookId: 50, chapter: 4, verse: 6, text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.', topics: ['Prayer', 'Peace', 'God'] },
  { bookId: 50, chapter: 4, verse: 7, text: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.', topics: ['Peace', 'God', 'Jesus'] },
  { bookId: 50, chapter: 4, verse: 8, text: 'Finally, brethren, whatsoever things are true, whatsoever things are honest, whatsoever things are just, whatsoever things are pure, whatsoever things are lovely, whatsoever things are of good report; if there be any virtue, and if there be any praise, think on these things.', topics: ['Wisdom', 'Peace'] },
  { bookId: 50, chapter: 4, verse: 11, text: 'Not that I speak in respect of want: for I have learned, in whatsoever state I am, therewith to be content.', topics: ['Peace', 'Wisdom'] },
  { bookId: 50, chapter: 4, verse: 13, text: 'I can do all things through Christ which strengtheneth me.', topics: ['Strength', 'Jesus', 'Faith'] },
  { bookId: 50, chapter: 4, verse: 19, text: 'But my God shall supply all your need according to his riches in glory by Christ Jesus.', topics: ['God', 'Money', 'Jesus'] },
  // Colossians
  { bookId: 51, chapter: 3, verse: 23, text: 'And whatsoever ye do, do it heartily, as to the Lord, and not unto men;', topics: ['Obedience', 'God', 'Worship'] },
  // 1 Thessalonians
  { bookId: 52, chapter: 5, verse: 16, text: 'Rejoice evermore.', topics: ['Worship', 'God'] },
  { bookId: 52, chapter: 5, verse: 17, text: 'Pray without ceasing.', topics: ['Prayer'] },
  { bookId: 52, chapter: 5, verse: 18, text: 'In every thing give thanks: for this is the will of God in Christ Jesus concerning you.', topics: ['Worship', 'God', 'Prayer'] },
  // 2 Timothy
  { bookId: 55, chapter: 1, verse: 7, text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.', topics: ['Fear', 'God', 'Holy Spirit', 'Strength'] },
  { bookId: 55, chapter: 3, verse: 16, text: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness:', topics: ['Bible', 'God', 'Wisdom'] },
  { bookId: 55, chapter: 3, verse: 17, text: 'That the man of God may be perfect, throughly furnished unto all good works.', topics: ['Bible', 'Obedience', 'God'] },
  { bookId: 55, chapter: 4, verse: 7, text: 'I have fought a good fight, I have finished my course, I have kept the faith:', topics: ['Faith', 'Hope'] },
  // Hebrews
  { bookId: 58, chapter: 4, verse: 12, text: 'For the word of God is quick, and powerful, and sharper than any twoedged sword, piercing even to the dividing asunder of soul and spirit, and of the joints and marrow, and is a discerner of the thoughts and intents of the heart.', topics: ['Bible', 'God'] },
  { bookId: 58, chapter: 11, verse: 1, text: 'Now faith is the substance of things hoped for, the evidence of things not seen.', topics: ['Faith', 'Hope'] },
  { bookId: 58, chapter: 11, verse: 6, text: 'But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.', topics: ['Faith', 'God'] },
  { bookId: 58, chapter: 12, verse: 1, text: 'Wherefore seeing we also are compassed about with so great a cloud of witnesses, let us lay aside every weight, and the sin which doth so easily beset us, and let us run with patience the race that is set before us,', topics: ['Faith', 'Sin', 'Hope'] },
  { bookId: 58, chapter: 12, verse: 2, text: 'Looking unto Jesus the author and finisher of our faith; who for the joy that was set before him endured the cross, despising the shame, and is set down at the right hand of the throne of God.', topics: ['Faith', 'Jesus', 'God'] },
  { bookId: 58, chapter: 13, verse: 5, text: 'Let your conversation be without covetousness; and be content with such things as ye have: for he hath said, I will never leave thee, nor forsake thee.', topics: ['God', 'Money', 'Peace'] },
  { bookId: 58, chapter: 13, verse: 8, text: 'Jesus Christ the same yesterday, and to day, and for ever.', topics: ['Jesus', 'God'] },
  // James
  { bookId: 59, chapter: 1, verse: 2, text: 'My brethren, count it all joy when ye fall into divers temptations;', topics: ['Faith', 'Wisdom'] },
  { bookId: 59, chapter: 1, verse: 3, text: 'Knowing this, that the trying of your faith worketh patience.', topics: ['Faith'] },
  { bookId: 59, chapter: 1, verse: 5, text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.', topics: ['Wisdom', 'Prayer', 'God'] },
  { bookId: 59, chapter: 2, verse: 17, text: 'Even so faith, if it hath not works, is dead, being alone.', topics: ['Faith', 'Obedience'] },
  { bookId: 59, chapter: 4, verse: 7, text: 'Submit yourselves therefore to God. Resist the devil, and he will flee from you.', topics: ['God', 'Obedience', 'Strength'] },
  { bookId: 59, chapter: 4, verse: 8, text: 'Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded.', topics: ['God', 'Prayer', 'Obedience'] },
  { bookId: 59, chapter: 5, verse: 16, text: 'Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.', topics: ['Prayer', 'Healing', 'Forgiveness'] },
  // 1 Peter
  { bookId: 60, chapter: 2, verse: 9, text: 'But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people; that ye should shew forth the praises of him who hath called you out of darkness into his marvellous light:', topics: ['Salvation', 'God', 'Worship'] },
  { bookId: 60, chapter: 5, verse: 7, text: 'Casting all your care upon him; for he careth for you.', topics: ['God', 'Peace', 'Prayer'] },
  // 1 John
  { bookId: 62, chapter: 1, verse: 9, text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.', topics: ['Forgiveness', 'Sin', 'Salvation'] },
  { bookId: 62, chapter: 4, verse: 7, text: 'Beloved, let us love one another: for love is of God; and every one that loveth is born of God, and knoweth God.', topics: ['Love', 'God'] },
  { bookId: 62, chapter: 4, verse: 8, text: 'He that loveth not knoweth not God; for God is love.', topics: ['Love', 'God'] },
  { bookId: 62, chapter: 4, verse: 9, text: 'In this was manifested the love of God toward us, because that God sent his only begotten Son into the world, that we might live through him.', topics: ['Love', 'God', 'Jesus', 'Salvation'] },
  { bookId: 62, chapter: 4, verse: 10, text: 'Herein is love, not that we loved God, but that he loved us, and sent his Son to be the propitiation for our sins.', topics: ['Love', 'God', 'Jesus', 'Forgiveness'] },
  { bookId: 62, chapter: 4, verse: 19, text: 'We love him, because he first loved us.', topics: ['Love', 'God'] },
  // Revelation
  { bookId: 66, chapter: 1, verse: 8, text: 'I am Alpha and Omega, the beginning and the ending, saith the Lord, which is, and which was, and which is to come, the Almighty.', topics: ['God', 'Jesus', 'End Times'] },
  { bookId: 66, chapter: 3, verse: 20, text: 'Behold, I stand at the door, and knock: if any man hear my voice, and open the door, I will come in to him, and will sup with him, and he with me.', topics: ['Jesus', 'Salvation', 'God'] },
  { bookId: 66, chapter: 21, verse: 1, text: 'And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.', topics: ['Heaven', 'End Times', 'Hope'] },
  { bookId: 66, chapter: 21, verse: 2, text: 'And I John saw the holy city, new Jerusalem, coming down from God out of heaven, prepared as a bride adorned for her husband.', topics: ['Heaven', 'End Times'] },
  { bookId: 66, chapter: 21, verse: 3, text: 'And I heard a great voice out of heaven saying, Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.', topics: ['Heaven', 'End Times', 'God'] },
  { bookId: 66, chapter: 21, verse: 4, text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.', topics: ['Heaven', 'End Times', 'Hope', 'God'] },
  { bookId: 66, chapter: 22, verse: 13, text: 'I am Alpha and Omega, the beginning and the end, the first and the last.', topics: ['Jesus', 'God', 'End Times'] },
  { bookId: 66, chapter: 22, verse: 20, text: 'He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.', topics: ['Jesus', 'End Times', 'Hope'] },
];

const TOPICS = [
  { name: 'Salvation',    description: 'Verses about redemption and being saved through Jesus Christ' },
  { name: 'Faith',        description: 'Verses about trust and belief in God' },
  { name: 'Love',         description: 'Verses about love — God\'s love and loving others' },
  { name: 'Prayer',       description: 'Verses about communicating with God through prayer' },
  { name: 'Peace',        description: 'Verses about the peace that comes from God' },
  { name: 'Wisdom',       description: 'Verses about wisdom and understanding' },
  { name: 'Strength',     description: 'Verses about strength and power through God' },
  { name: 'Hope',         description: 'Verses about hope and expectation in God' },
  { name: 'Creation',     description: 'Verses about God creating the world and all things' },
  { name: 'End Times',    description: 'Verses about the last days, second coming, and eternity' },
  { name: 'Heaven',       description: 'Verses about heaven and eternal life with God' },
  { name: 'Marriage',     description: 'Verses about marriage and the covenant between husband and wife' },
  { name: 'Money',        description: 'Verses about wealth, giving, and financial wisdom' },
  { name: 'Grace',        description: 'Verses about God\'s unmerited favor and grace' },
  { name: 'Forgiveness',  description: 'Verses about forgiving others and receiving forgiveness' },
  { name: 'Holy Spirit',  description: 'Verses about the Holy Spirit and His work' },
  { name: 'Jesus',        description: 'Verses about Jesus Christ, His life, death, and resurrection' },
  { name: 'God',          description: 'Verses about God the Father and His nature' },
  { name: 'Bible',        description: 'Verses about the Word of God and its authority' },
  { name: 'Worship',      description: 'Verses about worship and praising God' },
  { name: 'Obedience',    description: 'Verses about obeying God\'s commands' },
  { name: 'Sin',          description: 'Verses about sin and its consequences' },
  { name: 'Redemption',   description: 'Verses about being redeemed by the blood of Christ' },
  { name: 'Eternal Life', description: 'Verses about everlasting life through Jesus Christ' },
  { name: 'Fear',         description: 'Verses about fear of the Lord and overcoming fear' },
  { name: 'Healing',      description: 'Verses about physical and spiritual healing' },
  { name: 'Family',       description: 'Verses about family relationships and responsibilities' },
  { name: 'Miracles',     description: 'Verses about miracles and the supernatural acts of God' },
];

async function main(): Promise<void> {
  console.log('🌱 Starting Bible data seed...');

  // 1. Seed Bible books
  console.log('📚 Seeding Bible books...');
  for (const book of BIBLE_BOOKS) {
    await prisma.bibleBook.upsert({
      where: { id: book.id },
      update: { name: book.name, abbreviation: book.abbreviation, testament: book.testament, order: book.order, chapters: book.chapters },
      create: book,
    });
  }
  console.log(`✅ Seeded ${BIBLE_BOOKS.length} Bible books`);

  // 2. Seed Bible versions
  console.log('📖 Seeding Bible versions...');
  const versions = [
    { abbreviation: 'KJV', fullName: 'King James Version',       language: 'en', year: 1769, copyright: 'public_domain', isDefault: true,  description: 'The classic 1769 revision of the 1611 Authorized Version' },
    { abbreviation: 'ASV', fullName: 'American Standard Version', language: 'en', year: 1901, copyright: 'public_domain', isDefault: false, description: 'The 1901 American Standard Version' },
    { abbreviation: 'WEB', fullName: 'World English Bible',       language: 'en', year: 2000, copyright: 'public_domain', isDefault: false, description: 'A modern English translation in the public domain' },
  ];
  const versionMap: Record<string, string> = {};
  for (const version of versions) {
    const record = await prisma.bibleVersion.upsert({
      where: { abbreviation: version.abbreviation },
      update: version,
      create: version,
    });
    versionMap[version.abbreviation] = record.id;
  }
  console.log('✅ Seeded 3 Bible versions (KJV, ASV, WEB)');

  // 3. Seed topics
  console.log('🏷️  Seeding Bible topics...');
  const topicMap: Record<string, string> = {};
  for (const topic of TOPICS) {
    const record = await prisma.bibleTopic.upsert({
      where: { name: topic.name },
      update: { description: topic.description },
      create: topic,
    });
    topicMap[topic.name] = record.id;
  }
  console.log(`✅ Seeded ${TOPICS.length} topics`);

  // 4. Seed KJV verses
  console.log('📝 Seeding KJV verses...');
  const kjvId = versionMap['KJV'];
  let verseCount = 0;
  const verseIdMap: Record<string, string> = {};

  for (const v of KJV_VERSES) {
    const key = `${v.bookId}-${v.chapter}-${v.verse}`;
    const record = await prisma.bibleVerse.upsert({
      where: { versionId_bookId_chapter_verse: { versionId: kjvId, bookId: v.bookId, chapter: v.chapter, verse: v.verse } },
      update: { text: v.text },
      create: { versionId: kjvId, bookId: v.bookId, chapter: v.chapter, verse: v.verse, text: v.text },
    });
    verseIdMap[key] = record.id;
    verseCount++;
    if (verseCount % 50 === 0) console.log(`  ... seeded ${verseCount} verses`);
  }
  console.log(`✅ Seeded ${verseCount} KJV verses`);

  // 5. Link topics to verses
  console.log('🔗 Linking topics to verses...');
  let linkCount = 0;
  for (const v of KJV_VERSES) {
    if (!v.topics || v.topics.length === 0) continue;
    const key = `${v.bookId}-${v.chapter}-${v.verse}`;
    const verseId = verseIdMap[key];
    if (!verseId) continue;

    for (const topicName of v.topics) {
      const topicId = topicMap[topicName];
      if (!topicId) continue;
      await prisma.verseTopic.upsert({
        where: { verseId_topicId: { verseId, topicId } },
        update: {},
        create: { verseId, topicId },
      });
      linkCount++;
    }
  }
  console.log(`✅ Created ${linkCount} verse-topic links`);

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
